/* Firebase browser adapter. The demo remains usable when no Firebase config is supplied. */
(function () {
  const config = window.NEO_FIREBASE_CONFIG || {};
  const hasConfig = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);

  window.neoFirebase = {
    enabled: hasConfig,
    status: hasConfig ? 'connecting' : 'fallback',
    getInquiries: async () => [],
    getCustomerContext: async () => null,
    validateDraft: async draft => ({ valid: true, source: 'local-fallback', warnings: ['Firebase is not configured.'] , draft }),
    requestApproval: async () => ({ ok: false, reason: 'Firebase is not configured.' })
  };

  window.neoFirebaseReady = (async () => {
    if (!hasConfig) return window.neoFirebase;

    try {
      const [{ initializeApp }, authModule, firestoreModule] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js')
      ]);
      const app = initializeApp(config);
      const auth = authModule.getAuth(app);
      const db = firestoreModule.getFirestore(app);
      await authModule.signInAnonymously(auth);

      const tenantId = window.NEO_FIREBASE_TENANT_ID || 'demo';
      const inquiryCollection = firestoreModule.collection(db, 'tenants', tenantId, 'inquiries');
      const customerCollection = firestoreModule.collection(db, 'tenants', tenantId, 'customers');

      window.neoFirebase = {
        enabled: true,
        status: 'connected',
        getInquiries: async () => {
          const snapshot = await firestoreModule.getDocs(
            firestoreModule.query(inquiryCollection, firestoreModule.orderBy('receivedAt', 'desc'))
          );
          return snapshot.docs.map(record => ({ id: record.id, ...record.data() }));
        },
        getCustomerContext: async email => {
          const snapshot = await firestoreModule.getDocs(
            firestoreModule.query(customerCollection, firestoreModule.where('email', '==', email))
          );
          return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        },
        validateDraft: async draft => {
          const forbidden = /\b(guarantee|lowest price|100%|active subscription)\b/i;
          const warnings = forbidden.test(draft) ? ['Draft contains a claim that requires source verification.'] : [];
          return { valid: warnings.length === 0, source: 'local-policy', warnings, draft };
        },
        requestApproval: async ({ inquiryId, draft }) => {
          const result = await window.neoFirebase.validateDraft(draft);
          if (!result.valid) return { ok: false, reason: result.warnings.join(' ') };
          const approval = await firestoreModule.addDoc(
            firestoreModule.collection(db, 'tenants', tenantId, 'approvals'),
            {
              inquiryId,
              draft,
              status: 'pending',
              createdAt: firestoreModule.serverTimestamp()
            }
          );
          return { ok: true, approvalId: approval.id };
        }
      };
      return window.neoFirebase;
    } catch (error) {
      console.warn('Firebase unavailable; using local demo data.', error);
      window.neoFirebase = { ...window.neoFirebase, status: 'fallback', error };
      return window.neoFirebase;
    }
  })();
}());
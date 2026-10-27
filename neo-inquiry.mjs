#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.dirname(new URL(import.meta.url).pathname).replace(/^\//, '').replaceAll('/', path.sep);
const fixturePath = path.join(root, 'data', 'inquiries.json');
const customerFixturePath = path.join(root, 'data', 'customers.json');

async function loadFixtures() {
  return {
    inquiries: JSON.parse(await fs.readFile(fixturePath, 'utf8')),
    customers: JSON.parse(await fs.readFile(customerFixturePath, 'utf8'))
  };
}

function validateInquiries(inquiries) {
  const required = ['id', 'sender', 'subject', 'body', 'channel', 'priority', 'draft', 'receivedAt'];
  const errors = [];
  const ids = new Set();
  inquiries.forEach((inquiry, index) => {
    required.forEach(field => {
      if (!inquiry[field]) errors.push(`item ${index + 1}: missing ${field}`);
    });
    if (ids.has(inquiry.id)) errors.push(`item ${index + 1}: duplicate id ${inquiry.id}`);
    ids.add(inquiry.id);
    if (Number.isNaN(Date.parse(inquiry.receivedAt))) errors.push(`item ${index + 1}: invalid receivedAt`);
  });
  return errors;
}

async function validate() {
  const { inquiries, customers } = await loadFixtures();
  const errors = validateInquiries(inquiries);
  if (!customers.length) errors.push('customers: fixture is empty');
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
    return;
  }
  console.log(`Validated ${inquiries.length} inquiry and ${customers.length} customer fixtures.`);
}

async function seed() {
  const { inquiries, customers } = await loadFixtures();
  const errors = validateInquiries(inquiries);
  if (errors.length) throw new Error(errors.join('\n'));
  const { getFirestore } = await import('firebase-admin/firestore');
  const { initializeApp, applicationDefault, getApps } = await import('firebase-admin/app');
  if (!getApps().length) initializeApp({ credential: applicationDefault() });
  const db = getFirestore();
  const tenantId = process.env.NEO_TENANT_ID || 'demo';
  const batch = db.batch();
  inquiries.forEach(inquiry => {
    const { id, ...data } = inquiry;
    batch.set(db.collection('tenants').doc(tenantId).collection('inquiries').doc(id), data);
  });
  customers.forEach(customer => {
    const { id, ...data } = customer;
    batch.set(db.collection('tenants').doc(tenantId).collection('customers').doc(id), data);
  });
  await batch.commit();
  console.log(`Seeded ${inquiries.length} inquiries and ${customers.length} customers into tenant ${tenantId}.`);
}

async function checkDeploy() {
  const required = ['GOOGLE_APPLICATION_CREDENTIALS', 'NEO_TENANT_ID'];
  const missing = required.filter(name => !process.env[name]);
  if (missing.length) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    process.exitCode = 1;
    return;
  }
  console.log('Firebase deployment environment is configured.');
}

const command = process.argv[2] || 'validate';
if (command === 'validate') await validate();
else if (command === 'seed') await seed();
else if (command === 'check-deploy') await checkDeploy();
else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}
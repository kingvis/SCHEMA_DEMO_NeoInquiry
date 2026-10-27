#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';

if (!getApps().length) initializeApp({ credential: applicationDefault() });

const db = getFirestore();
const configuredTenant = process.env.NEO_TENANT_ID || 'demo';

function assertTenant(tenantId) {
  if (tenantId !== configuredTenant) {
    throw new Error('Tenant is not authorized for this MCP process.');
  }
}

async function searchInquiries({ tenantId, query, limit }) {
  assertTenant(tenantId);
  const snapshot = await db.collection('tenants').doc(tenantId).collection('inquiries').limit(100).get();
  const normalizedQuery = (query || '').toLowerCase();
  return snapshot.docs
    .map(record => ({ id: record.id, ...record.data() }))
    .filter(inquiry => !normalizedQuery || [inquiry.sender, inquiry.subject, inquiry.preview, inquiry.intent]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery))
    .slice(0, limit);
}

async function getCustomerContext({ tenantId, email }) {
  assertTenant(tenantId);
  const snapshot = await db.collection('tenants').doc(tenantId).collection('customers')
    .where('email', '==', email)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

const server = new McpServer({
  name: 'neoinquiry-firebase',
  version: '0.1.0'
});

server.tool(
  'search_inquiries',
  'Search tenant-scoped customer inquiries. Read-only.',
  {
    tenantId: z.string().min(1),
    query: z.string().optional(),
    limit: z.number().int().min(1).max(50).default(20)
  },
  async args => ({
    content: [{ type: 'text', text: JSON.stringify(await searchInquiries(args)) }]
  })
);

server.tool(
  'get_customer_context',
  'Retrieve verified customer context by email. Read-only.',
  {
    tenantId: z.string().min(1),
    email: z.string().email()
  },
  async args => ({
    content: [{ type: 'text', text: JSON.stringify(await getCustomerContext(args)) }]
  })
);

await server.connect(new StdioServerTransport());
<template>
  <UiContainer>
    <section class="py-10">
      <h1 class="text-3xl font-bold">Comparison Hub</h1>
      <p class="mt-2 text-zinc-700">Filter by category, use case, and price. Pin up to 3 vendors for side‑by‑side comparison.</p>

      <!-- Filters (stub) -->
      <div class="mt-6 flex flex-wrap gap-3">
        <select class="border rounded px-3 py-2">
          <option>All Categories</option>
          <option>CRM Bots</option>
          <option>Sales Bots</option>
          <option>Support Bots</option>
          <option>E‑commerce Bots</option>
          <option>DIY / Integrators</option>
        </select>
        <select class="border rounded px-3 py-2">
          <option>Any Price</option>
          <option>Free</option>
          <option>Under $50</option>
          <option>$50–$150</option>
          <option>$150+</option>
        </select>
      </div>

      <!-- Table (stub) -->
      <div class="mt-6 overflow-x-auto">
        <table class="table min-w-[1000px]">
          <thead>
            <tr>
              <th>Feature Group</th>
              <th>HubSpot</th>
              <th>Zoho</th>
              <th>Intercom</th>
              <th>Drift</th>
              <th>Tidio</th>
              <th>Manychat</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Initial Contact & Lead Capture</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
            <tr><td>Sales Automation</td><td>✓</td><td>✓</td><td>Partial</td><td>✓</td><td>Basic</td><td>Basic</td></tr>
            <tr><td>Post‑Sales Support</td><td>Service Hub</td><td>Yes</td><td>Fin bot</td><td>—</td><td>Limited</td><td>—</td></tr>
            <tr><td>CRM Integration</td><td>Native</td><td>Native</td><td>3rd‑party</td><td>3rd‑party</td><td>Shopify</td><td>Meta</td></tr>
            <tr><td>AI Capabilities</td><td>Basic</td><td>Zia</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
            <tr><td>Pricing</td><td>$</td><td>$</td><td>$$</td><td>$$$$</td><td>$$</td><td>$</td></tr>
            <tr><td>Target Audience Fit</td><td>SME/Enterprise</td><td>SME</td><td>Startups/SME</td><td>Enterprise</td><td>E‑com</td><td>E‑com</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </UiContainer>
</template>
<script setup lang="ts">
import UiContainer from '@/components/UiContainer.vue'
</script>
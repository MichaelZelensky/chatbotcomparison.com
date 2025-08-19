<template>
  <div class="card">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Preview: Interactive Comparison</h3>
      <NuxtLink class="btn btn-ghost" to="/comparison">Open Full Table</NuxtLink>
    </div>
    <div class="mt-4 overflow-x-auto">
      <table class="table min-w-[720px]">
        <thead>
          <tr>
            <th>Feature Group</th>
            <th>HubSpot</th>
            <th>Intercom</th>
            <th>Drift</th>
            <th>Tidio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Initial Contact & Lead Capture</td>
            <td>✓</td><td>✓</td><td>✓</td><td>✓</td>
          </tr>
          <tr>
            <td>Sales Automation</td>
            <td>✓</td><td>Partial</td><td>✓</td><td>Basic</td>
          </tr>
          <tr>
            <td>Post‑Sales Support</td>
            <td>Service Hub</td><td>Fin bot</td><td>—</td><td>Limited</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
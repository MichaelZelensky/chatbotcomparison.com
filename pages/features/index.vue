<template>
  <section>
    <h1>All features</h1>
    <ul class="mt-4">
      <li><NuxtLink to="/features/additionalAgentPrice">Additional Agents (per month)</NuxtLink></li>
      <li><NuxtLink to="/features/agentsIncluded">Agents Included</NuxtLink></li>
      <li><NuxtLink to="/features/aiUsage">AI Usage</NuxtLink></li>
      <li><NuxtLink to="/features/billableConversations">Billable Conversations Limit</NuxtLink></li>
      <li><NuxtLink to="/features/chatsPackage">Chats Package</NuxtLink></li>
      <li><NuxtLink to="/features/cloudBased">Cloud-based</NuxtLink></li>
      <li><NuxtLink to="/features/customerProfiles">Customer Profiles</NuxtLink></li>
      <li><NuxtLink to="/features/desktopApps">Desktop Apps</NuxtLink></li>
      <li><NuxtLink to="/features/freeTrial">Free Trial</NuxtLink></li>
      <li><NuxtLink to="/features/mobileApps">Mobile Apps</NuxtLink></li>
      <li><NuxtLink to="/features/paidChats">Paid chats</NuxtLink></li>
      <li><NuxtLink to="/features/planPrice">Plan Price (per month)</NuxtLink></li>
      <li><NuxtLink to="/features/realtimeNotif">Real-time Notifications</NuxtLink></li>
    </ul>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'content' });
useSeoMeta({ title: 'All features' });
</script>

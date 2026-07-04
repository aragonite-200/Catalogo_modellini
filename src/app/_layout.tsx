import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="all-model">
        <NativeTabs.Trigger.Label>Collezione</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="folder.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="add-model" role='search'>
        <NativeTabs.Trigger.Label>Aggiungi</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="plus.circle" md="home" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}


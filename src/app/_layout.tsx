import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '@/utils/db_init';

export default function TabLayout() {
  return (
    <SQLiteProvider databaseName="database" onInit={initializeDatabase}>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="all-model">
          <NativeTabs.Trigger.Label>Collezione</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="folder.fill" md="folder" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="add-model" role='search'>
          <NativeTabs.Trigger.Label>Aggiungi</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="plus.circle" md="add" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </SQLiteProvider>
  );
}


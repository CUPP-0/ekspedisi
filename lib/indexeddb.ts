import { openDB } from "idb";

export async function getDB() {
  return openDB("ekspedisi-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("shipments")) {
        db.createObjectStore("shipments");
      }

      if (!db.objectStoreNames.contains("shipment-detail")) {
        db.createObjectStore("shipment-detail");
      }

      if (!db.objectStoreNames.contains("profile")) {
        db.createObjectStore("profile");
      }
    },
  });
}
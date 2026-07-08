"use client";

import { useEffect, useState } from "react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  total_shipment: number;
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  async function getCustomers() {
    setLoading(true);

    try {
      const res = await fetch("/api/customers");
      const data = await res.json();

      setCustomers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Data Customer
        </h1>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Nama</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Telepon</th>
              <th className="p-4 text-left">Alamat</th>
              <th className="p-4 text-center">Total Shipment</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10"
                >
                  Loading...
                </td>
              </tr>

            ) : customers.length === 0 ? (

              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10"
                >
                  Belum ada customer.
                </td>
              </tr>

            ) : (

              customers.map((customer, index) => (

                <tr
                  key={customer.id}
                  className="border-t"
                >

                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{customer.name}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.phone}</td>
                  <td className="p-4">{customer.address}</td>
                  <td className="p-4 text-center">
                    {customer.total_shipment}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
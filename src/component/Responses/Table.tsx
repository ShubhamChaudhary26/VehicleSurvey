"use client";

import React, { useEffect, useState } from "react";
import styles from "./Table.module.css";

// Define the interface for your data based on the updated schema
interface UserData {
  _id: string;
  industry: string;
  customIndustry?: string;
  name: string;
  age: string;
  gender: string;
  city: string;
  otherCity?: string;
  purchaseType: string;
  brand?: string;
  vehicleModel?: string;
  customModel?: string;
  purchaseMonth?: string;
  purchaseYear?: string;
  vehicleCondition?: string;
  recommendLikelihood: number;
  recommendReason?: string[];
  customReason?: string;
  satisfactionLevel: number;
  repurchaseLikelihood: number;
  alternativeBrand?: string;
  customAlternativeBrand?: string;
  alternativeVehicle?: string;
  customAlternativeModelOther?: string;
  email?: string;
  contactNumber?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const Table = () => {
  const [data, setData] = useState<UserData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/submit");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!data || data.length === 0)
    return <div className={styles.noData}>No data available</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Data</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.headerCell}>Industry</th>
              <th className={styles.headerCell}>Name</th>
              <th className={styles.headerCell}>Age</th>
              <th className={styles.headerCell}>Gender</th>
              <th className={styles.headerCell}>City</th>
              <th className={styles.headerCell}>Other City</th>
              <th className={styles.headerCell}>Purchase Type</th>
              <th className={styles.headerCell}>Brand</th>
              <th className={styles.headerCell}>Vehicle Model</th>
              <th className={styles.headerCell}>Purchase Month</th>
              <th className={styles.headerCell}>Purchase Year</th>
              <th className={styles.headerCell}>Vehicle Condition</th>
              <th className={styles.headerCell}>Recommend Likelihood</th>
              <th className={styles.headerCell}>Recommend Reason</th>
              <th className={styles.headerCell}>Satisfaction Level</th>
              <th className={styles.headerCell}>Repurchase Likelihood</th>
              <th className={styles.headerCell}>Alternative Brand</th>
              <th className={styles.headerCell}>Alternative Vehicle</th>
              <th className={styles.headerCell}>Email</th>
              <th className={styles.headerCell}>Contact Number</th>
              <th className={styles.headerCell}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className={styles.row}>
                <td className={styles.cell}>{item.industry}</td>
                <td className={styles.cell}>{item.name}</td>
                <td className={styles.cell}>{item.age}</td>
                <td className={styles.cell}>{item.gender}</td>
                <td className={styles.cell}>{item.city}</td>
                <td className={styles.cell}>{item.otherCity || '-'}</td>
                <td className={styles.cell}>{item.purchaseType}</td>
                <td className={styles.cell}>{item.brand || '-'}</td>
                <td className={styles.cell}>{item.vehicleModel || '-'}</td>
                <td className={styles.cell}>{item.purchaseMonth || '-'}</td>
                <td className={styles.cell}>{item.purchaseYear || '-'}</td>
                <td className={styles.cell}>{item.vehicleCondition || '-'}</td>
                <td className={styles.cell}>{item.recommendLikelihood}</td>
                <td className={styles.cell}>
                  {item.recommendReason?.length ? (
                    <ul className={styles.recommendList}>
                      {item.recommendReason.map((reason, index) => (
                        <li key={index} className={styles.recommendItem}>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    '-'
                  )}
                </td>
                <td className={styles.cell}>{item.satisfactionLevel}</td>
                <td className={styles.cell}>{item.repurchaseLikelihood}</td>
                <td className={styles.cell}>{item.alternativeBrand || '-'}</td>
                <td className={styles.cell}>{item.alternativeVehicle || '-'}</td>
                <td className={styles.cell}>{item.email || '-'}</td>
                <td className={styles.cell}>{item.contactNumber || '-'}</td>
                <td className={styles.cell}>
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
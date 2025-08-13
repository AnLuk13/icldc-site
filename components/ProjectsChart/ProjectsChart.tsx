"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import styles from "./ProjectsChart.module.scss";

const ProjectsChart = () => {
  const t = useTranslations("home");

  // Sample data - in a real app, this would come from an API
  const barData = [
    { year: "2020", projects: 8 },
    { year: "2021", projects: 15 },
    { year: "2022", projects: 23 },
    { year: "2023", projects: 31 },
    { year: "2024", projects: 42 },
  ];

  const pieData = [
    { name: "Research", value: 45, color: "#3b82f6" },
    { name: "Development", value: 35, color: "#10b981" },
    { name: "Collaboration", value: 39, color: "#f59e0b" },
  ];

  const chartConfig = {
    projects: {
      label: "Projects",
      color: "#2563eb",
    },
    research: {
      label: "Research",
      color: "#3b82f6",
    },
    development: {
      label: "Development",
      color: "#10b981",
    },
    collaboration: {
      label: "Collaboration",
      color: "#f59e0b",
    },
  };

  const totalProjects = barData.reduce((sum, item) => sum + item.projects, 0);

  return (
    <section className={styles.chartsSection}>
      <div className="container">
        <div className={styles.chartsHeader}>
          <h2 className={styles.chartsTitle}>
            {t("projectsChartTitle", { defaultValue: "Our Project Impact" })}
          </h2>
          <p className={styles.chartsSubtitle}>
            {t("projectsChartSubtitle", {
              defaultValue: `${totalProjects} successful projects completed across various domains`,
            })}
          </p>
        </div>

        <div className={styles.chartsGrid}>
          {/* Bar Chart - Projects Over Time */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              {t("projectsOverTime", { defaultValue: "Projects Over Time" })}
            </h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Bar
                    dataKey="projects"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Projects by Category */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              {t("projectsByCategory", {
                defaultValue: "Projects by Category",
              })}
            </h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className={styles.pieChartLegend}>
              {pieData.map((entry, index) => (
                <div key={entry.name} className={styles.legendItem}>
                  <div
                    className={styles.legendColor}
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className={styles.legendLabel}>
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalProjects}</div>
            <div className={styles.statLabel}>
              {t("totalProjects", { defaultValue: "Total Projects" })}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>5</div>
            <div className={styles.statLabel}>
              {t("yearsActive", { defaultValue: "Years Active" })}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>95%</div>
            <div className={styles.statLabel}>
              {t("successRate", { defaultValue: "Success Rate" })}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>
              {t("partners", { defaultValue: "Partners" })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsChart;

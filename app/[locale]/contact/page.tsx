"use client"

import type React from "react"

import { useTranslations } from "next-intl"
import { useState } from "react"
import styles from "./page.module.scss"

export default function ContactPage() {
  const t = useTranslations("contact")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })

      setTimeout(() => {
        setSubmitStatus(null)
      }, 3000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className={styles.contact}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
          </div>

          <div className={styles.contactContent}>
            <div className={styles.contactInfo}>
              <div className={styles.infoCard}>
                <h3 className="accent-text">{t("address")}</h3>
                <p>
                  Str. Ștefan cel Mare 123
                  <br />
                  Chișinău, MD-2001
                  <br />
                  Republica Moldova
                </p>
              </div>

              <div className={styles.infoCard}>
                <h3 className="accent-text">{t("phone")}</h3>
                <p>+373 22 123 456</p>
              </div>

              <div className={styles.infoCard}>
                <h3 className="accent-text">{t("email")}</h3>
                <p>contact@icldc.md</p>
              </div>
            </div>

            <div className={styles.contactForm}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">{t("form.name")}</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">{t("form.email")}</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">{t("form.subject")}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">{t("form.message")}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? "Se trimite..." : t("form.send")}
                </button>

                {submitStatus === "success" && <div className={styles.successMessage}>{t("form.success")}</div>}

                {submitStatus === "error" && <div className={styles.errorMessage}>{t("form.error")}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

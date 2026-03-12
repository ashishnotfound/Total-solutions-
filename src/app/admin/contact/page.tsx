"use client";
import AdminLayout from "../components/AdminLayout";
import ContentEditor from "../components/ContentEditor";

export default function ContactPage() {
  return (
    <AdminLayout>
      <ContentEditor
        contentType="contact"
        title="Contact Information Management"
        description="Manage your contact details and locations"
      />
    </AdminLayout>
  );
}

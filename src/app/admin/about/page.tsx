"use client";
import AdminLayout from "../components/AdminLayout";
import ContentEditor from "../components/ContentEditor";

export default function AboutPage() {
  return (
    <AdminLayout>
      <ContentEditor
        contentType="about"
        title="About Page Management"
        description="Manage your company story and information"
      />
    </AdminLayout>
  );
}

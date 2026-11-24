import { DirectoryShell } from "@/components/shell/directory-shell";
import { SiteHeader } from "@/components/shell/site-header";
import { categories } from "@/data/categories";
import { resources } from "@/data/resources";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <DirectoryShell resources={resources} categories={categories} />
    </>
  );
}

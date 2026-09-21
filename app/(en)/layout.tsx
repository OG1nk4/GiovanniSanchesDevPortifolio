import '../globals.css';
import { buildMetadata, RootHtml } from '@/lib/site';

export { viewport } from '@/lib/site';
export const metadata = buildMetadata('en');

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="en">{children}</RootHtml>;
}

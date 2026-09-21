import '../globals.css';
import { buildMetadata, RootHtml } from '@/lib/site';

export { viewport } from '@/lib/site';
export const metadata = buildMetadata('pt');

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="pt">{children}</RootHtml>;
}

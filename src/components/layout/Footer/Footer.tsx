import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '@/constants';

const footerLinks = {
  shop: {
    title: 'Tienda',
    links: [
      { label: 'Todos los productos', href: ROUTES.PRODUCTS },
      { label: 'Categorías', href: ROUTES.CATEGORIES },
      { label: 'Ofertas', href: '/ofertas' },
      { label: 'Novedades', href: '/novedades' },
    ],
  },
  account: {
    title: 'Mi cuenta',
    links: [
      { label: 'Mi perfil', href: ROUTES.PROFILE },
      { label: 'Mis pedidos', href: ROUTES.ORDERS },
      { label: 'Lista de deseos', href: ROUTES.WISHLIST },
      { label: 'Direcciones', href: ROUTES.ADDRESSES },
    ],
  },
  help: {
    title: 'Ayuda',
    links: [
      { label: 'Preguntas frecuentes', href: '/faq' },
      { label: 'Envíos', href: '/envios' },
      { label: 'Devoluciones', href: '/devoluciones' },
      { label: 'Contacto', href: ROUTES.CONTACT },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Términos y condiciones', href: '/terminos' },
      { label: 'Política de privacidad', href: '/privacidad' },
      { label: 'Política de cookies', href: '/cookies' },
    ],
  },
};

const socialLinks = [
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Twitter', icon: Twitter, href: '#' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-background">
      {/* Gold top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-sage-gold/30 to-transparent" />

      {/* Atmospheric glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-sage-gold/[0.03] blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Contact */}
          <div className="col-span-2 lg:col-span-1">
            <Link href={ROUTES.HOME} className="group inline-block">
              <span className="text-xl font-bold text-sage-cream tracking-tighter font-display">
                {APP_CONFIG.SITE_NAME}
              </span>
              <span className="block mt-0.5 h-px w-0 group-hover:w-full bg-sage-gold transition-all duration-500" />
            </Link>
            <p className="mt-4 text-sm text-sage-ivory/50 leading-relaxed max-w-xs">
              Perfumes de ambiente que transforman cada espacio en una experiencia sensorial única.
            </p>
            <div className="mt-6 space-y-2.5">
              <a href="mailto:info@lepas-sage.com" className="flex items-center gap-2.5 text-sm text-sage-ivory/50 hover:text-sage-gold transition-colors group">
                <Mail className="h-4 w-4 text-sage-gold/50 group-hover:text-sage-gold transition-colors" />
                info@lepas-sage.com
              </a>
              <a href="tel:+5491112345678" className="flex items-center gap-2.5 text-sm text-sage-ivory/50 hover:text-sage-gold transition-colors group">
                <Phone className="h-4 w-4 text-sage-gold/50 group-hover:text-sage-gold transition-colors" />
                +54 9 11 1234-5678
              </a>
              <div className="flex items-center gap-2.5 text-sm text-sage-ivory/40">
                <MapPin className="h-4 w-4 text-sage-gold/50" />
                Buenos Aires, Argentina
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-gold/70">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-sage-ivory/50 hover:text-sage-cream transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-14 pt-8 border-t border-sage-surface-light/60">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-sage-ivory/30">
              &copy; {currentYear} {APP_CONFIG.SITE_NAME}. Todos los derechos reservados.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sage-surface-light text-sage-ivory/40 hover:border-sage-gold/30 hover:text-sage-gold transition-all duration-300"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

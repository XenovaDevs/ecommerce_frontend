import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '@/constants';

/**
 * @ai-context Main footer component with links, contact info, and social media.
 */

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
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={ROUTES.HOME} className="text-xl font-bold text-primary">
              {APP_CONFIG.SITE_NAME}
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              {APP_CONFIG.SITE_DESCRIPTION}
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@tienda.com" className="hover:text-primary">
                  info@tienda.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <a href="tel:+5491112345678" className="hover:text-primary">
                  +54 9 11 1234-5678
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-gray-900">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary"
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
        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-200 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} {APP_CONFIG.SITE_NAME}. Todos los derechos reservados.
          </p>

          {/* Social links */}
          <div className="mt-4 flex items-center gap-4 md:mt-0">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-gray-400 hover:text-primary"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faThreads, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Thank you! You have been successfully subscribed to our newsletter.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setStatus('error');
      setMessage('Failed to subscribe');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 3000);
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Newsletter - Smaller */}
        <div className="mb-4 sm:mb-6">
          <div className="max-w-lg mx-auto text-center px-2">
            <h3 className="text-sm sm:text-base font-medium text-white mb-1">Subscribe to our Newsletter</h3>
            <p className="text-xs text-gray-400 mb-2">Stay updated with our latest news</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-1 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-white text-white placeholder-gray-400"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-3 py-1 text-xs bg-white text-black rounded hover:bg-cyan-400 disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p className={`mt-1 text-xs ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          {/* Brand Section - Smaller */}
          <div className="space-y-2 text-center sm:text-left">
            <Link href="/" className="text-lg sm:text-xl font-bold text-white hover:text-cyan-400">
              Lovosis
            </Link>
            <p className="text-xs text-gray-400">
              Transforming ideas into digital reality with innovative solutions.
            </p>
            <div className="flex justify-center sm:justify-start space-x-2">
              <a href="https://www.instagram.com/lovosis_technology_private_ltd" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
              </a>
              <a href="https://www.threads.net/@lovosis_technology_private_ltd" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <FontAwesomeIcon icon={faThreads} className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/company/lovosis-technology-private-limited" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links - Smaller */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-medium text-white mb-2">Quick Links</h3>
            <ul className="space-y-1 text-xs">
              {['About', 'Services', 'Products', 'Contact', 'Gallery', 'Careers'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources - Smaller */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-medium text-white mb-2">Resources</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link
                  href="/certificates"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  Certificates
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact - Smaller */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-medium text-white mb-2">Contact Us</h3>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="break-words">
                <a href="https://www.google.com/maps/place/Lovosis+Technology+Private+limited/@13.075368,77.533578,17z/data=!4m6!3m5!1s0x3bae23e28f4d4575:0x82fc68d725417776!8m2!3d13.0753677!4d77.5335779!16s%2Fg%2F11wy3573dv?hl=en&entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="hover:text-cyan-400 transition-colors duration-300">
                  4-72/2, Swathi Building, 3rd Floor, Opp. Singapura Garden, 1st Main Lakshmipura Road, Abbigere, Bengaluru, Karnataka 560090
                </a>
              </li>
              <li>
                Email: <a href="mailto:info@lovosis.in" className="hover:text-cyan-400 transition-colors duration-300">info@lovosis.in</a>
              </li>
              <li>
                Email: <a href="mailto:lovosist@gmail.com" className="hover:text-cyan-400 transition-colors duration-300">lovosist@gmail.com</a>
              </li>
              <li>
                Phone: <a href="tel:+917012970281" className="hover:text-cyan-400 transition-colors duration-300">+91 7012970281</a>
              </li>
              <li>
                Phone: <a href="tel:+919747745544" className="hover:text-cyan-400 transition-colors duration-300">+91 9747745544</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Smaller */}
        <div className="border-t border-gray-800 mt-4 sm:mt-6 pt-3 sm:pt-4">
          <div className="text-center text-xs text-gray-400">
            <p>&copy; {currentYear} lovosis. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
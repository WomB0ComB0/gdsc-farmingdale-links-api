import React from 'react'
const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  /* yyyy-mm-dd format */
  const foundingYear = new Date("2023-08-28").getFullYear();
  return (
    <footer>
      <p>© {foundingYear}-{foundingYear} GDSC Farmingdale</p>
      <p>Made with 🖤 by <a target={`_blank`} href="https://mikeodnis.com/">
          Mike Odnis
        </a>
      </p>
    </footer>
  )
}
export default Footer

"use client";

import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";

// ナビゲーション
const Footer = () => {
  return (
    <footer className="py-5">
      <div className="text-center text-sm">
        Copyright © All rights reserved |{" "}
        <Link
          href="https://github.com/leafeon-b"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

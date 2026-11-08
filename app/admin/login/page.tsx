"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Icon, Logo } from "../../components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push("/admin");
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <Logo light />
        <div>
          <p className="eyebrow">Portal pengelola data</p>
          <h1>
            Jaga data kota
            <br />
            tetap dapat dipercaya.
          </h1>
          <p>
            Perbarui indikator, telusuri riwayat perubahan, dan hitung ulang
            indeks dari satu tempat.
          </p>
        </div>
        <blockquote>
          &ldquo;Kota yang baik dimulai dari data yang dibaca dengan
          jernih.&rdquo;
        </blockquote>
      </section>
      <section className="login-form-wrap">
        <form onSubmit={handleSubmit}>
          <Link className="back-link" href="/">
            <span aria-hidden="true">← </span>Kembali ke situs publik
          </Link>
          <div>
            <p className="eyebrow">Akses terbatas</p>
            <h2>Masuk sebagai pengelola</h2>
            <p>Gunakan akun yang disediakan pengelola sistem.</p>
          </div>
          <label>
            Alamat email
            <input
              type="email"
              defaultValue="admin@ruangbogor.id"
              required
            />
          </label>
          <label>
            Kata sandi
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                defaultValue="password123"
                required
              />
              <button
                type="button"
                aria-pressed={showPassword}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </label>
          <label className="remember">
            <input type="checkbox" defaultChecked />
            Ingat saya di perangkat ini
          </label>
          <button type="submit" className="button full">
            Masuk ke panel admin <Icon name="arrow" />
          </button>
          <small>
            <Icon name="info" size={14} />
            Akses dan aktivitas pengelola dicatat untuk akuntabilitas data.
          </small>
        </form>
      </section>
    </main>
  );
}

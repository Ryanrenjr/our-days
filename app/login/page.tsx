"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        window.location.href = "/";
      }
    };

    checkUser();
  }, []);

  const handleLogin = async () => {
    if (!email.trim()) {
      setMessage("请输入邮箱。");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("登录链接已发送到你的邮箱，请查收并点击登录。");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-main)] px-6 py-10">
      <div className="mx-auto max-w-xl">
        <div className="toss-card p-8 md:p-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
            LOGIN
          </p>

          <h1 className="mt-3 text-[40px] font-bold tracking-[-0.05em] text-[var(--text-main)]">
            登录 Our Days
          </h1>

          <p className="mt-4 text-[16px] leading-7 text-[var(--text-muted)]">
            输入邮箱，我们会发送一个登录链接。你和你的伴侣都可以使用自己的邮箱登录。
          </p>

          <div className="mt-8 grid gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="rounded-[16px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-[15px] outline-none"
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="rounded-[16px] bg-[var(--text-main)] px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? "发送中..." : "发送登录链接"}
            </button>

            {message && (
              <p className="text-sm leading-6 text-[var(--text-muted)]">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
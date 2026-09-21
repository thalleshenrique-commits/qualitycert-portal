(async () => {
  const cfg = window.QUALITYCERT_SUPABASE || {};
  if (!cfg.url || cfg.url.includes('COLE_AQUI') || !cfg.anonKey || cfg.anonKey.includes('COLE_AQUI')) {
    document.documentElement.innerHTML = `<body style="font-family:Segoe UI,Arial;padding:40px;background:#f6f3f8;color:#26212c"><div style="max-width:720px;margin:auto;background:white;padding:28px;border-radius:18px;border:1px solid #e8e0ec"><h1 style="color:#5b2382">Portal Qualitycert</h1><p>O portal v5 está pronto para autenticação, mas o Supabase ainda precisa ser conectado ao arquivo <b>config.js</b>.</p><p>Preencha a URL do projeto e a chave pública anon/publishable do Supabase e publique novamente.</p></div></body>`;
    return;
  }
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const supabase = createClient(cfg.url, cfg.anonKey);
  window.qcSupabase = supabase;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const here = encodeURIComponent(location.pathname.split('/').pop() || 'index.html');
    location.replace(`login.html?next=${here}`);
    return;
  }
  window.qcSession = session;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
  window.qcProfile = profile || { full_name: session.user.email, area: 'Novato', role: 'colaborador' };
  document.dispatchEvent(new CustomEvent('qualitycert-auth-ready', { detail: { session, profile: window.qcProfile, supabase } }));
})();

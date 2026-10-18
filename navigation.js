(function(){
  const current=location.pathname.split('/').pop()||'index.html';
  const root='index_images/nav/';
  const routes=[
    ['index.html','Packs','packs.webp'],
    ['collection.html','Collection','collection.webp'],
    ['card-index.html','Card Index','card-index.webp'],
    ['trade.html','Trade','trade.webp']
  ];
  const top=document.getElementById('site-top-nav');
  const bottom=document.getElementById('site-bottom-nav');
  function icon(file){const i=document.createElement('img');i.className='nav-art-icon';i.src=root+file;i.alt='';i.width=32;i.height=32;i.decoding='async';i.setAttribute('aria-hidden','true');return i;}
  if(top){
    top.className='top-nav';top.setAttribute('aria-label','Account navigation');
    const brand=document.createElement('span');brand.className='nav-brand';brand.textContent='JMSS TCG';
    const items=document.createElement('div');items.className='nav-account';
    [['sign_in_programmable.html','Sign In','sign-in.webp'],['create_your_account.html','Sign Up','sign-up.webp']].forEach(([url,label,file])=>{
      const a=document.createElement('a');a.href=url;a.append(icon(file),document.createTextNode(label));
      if(url===current)a.setAttribute('aria-current','page');items.append(a);
    });
    top.append(brand,items);
  }
  if(bottom){
    bottom.className='bottom-nav';bottom.setAttribute('aria-label','Main navigation');
    routes.forEach(([url,label,file])=>{
      const a=document.createElement('a');a.href=url;
      const t=document.createElement('span');t.textContent=label;
      a.append(icon(file),t);
      if(url===current)a.setAttribute('aria-current','page');
      bottom.append(a);
    });
  }
})();
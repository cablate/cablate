let Capacitor=null,Filesystem=null,Directory=null;const initCapacitor=async()=>{try{if(window.Capacitor){Capacitor=window.Capacitor;const r=window.Capacitor.Plugins;return Filesystem=r.Filesystem,Directory={DOCUMENTS:"DOCUMENTS",DATA:"DATA",CACHE:"CACHE",EXTERNAL:"EXTERNAL",EXTERNAL_STORAGE:"EXTERNAL_STORAGE",PICTURES:"PICTURES"},{isNative:!0,platform:Capacitor.getPlatform()}}return Capacitor={isNativePlatform:()=>!1,getPlatform:()=>"web"},Filesystem={writeFile:async({path:r,data:t})=>({uri:t})},Directory={DOCUMENTS:"DOCUMENTS",DATA:"DATA",CACHE:"CACHE",EXTERNAL:"EXTERNAL",EXTERNAL_STORAGE:"EXTERNAL_STORAGE",PICTURES:"PICTURES"},{isNative:!1,platform:"web"}}catch(r){return console.error("初始化 Capacitor 時出錯:",r),{isNative:!1,platform:"web",error:r.message}}},checkPermissions=async r=>{if(!Capacitor||!Capacitor.isNativePlatform())return!0;try{return!0}catch(r){return console.error("權限檢查失敗:",r),!1}};export{initCapacitor,checkPermissions,Capacitor,Filesystem,Directory};
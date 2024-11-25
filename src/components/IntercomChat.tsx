import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}

export default function IntercomChat() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    window.intercomSettings = {
      app_id: import.meta.env.VITE_INTERCOM_APP_ID,
      user_id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      created_at: Math.floor(new Date(user.created_at).getTime() / 1000),
    };

    // Load Intercom
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + import.meta.env.VITE_INTERCOM_APP_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();

    // Cleanup
    return () => {
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
    };
  }, [user]);

  return null;
}
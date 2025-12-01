import React from 'react';
import { Mail, MapPin, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-lg">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">تواصل معنا</h2>
            <p className="text-gray-400">
              هل لديك استفسار أو اقتراح؟ نحن هنا للاستماع إليك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-labPrimary/20 p-3 rounded-lg ml-4">
                  <Mail className="w-6 h-6 text-labPrimary" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">البريد الإلكتروني</h4>
                  <a href="mailto:LAB4@AI.COM" className="text-gray-400 hover:text-white transition-colors">LAB4@AI.COM</a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-labSecondary/20 p-3 rounded-lg ml-4">
                  <MapPin className="w-6 h-6 text-labSecondary" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">الموقع</h4>
                  <p className="text-gray-400">المملكة العربية السعودية - الرياض</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                 <p className="text-sm text-gray-500 leading-relaxed">
                   نحن ملتزمون بالرد على جميع الاستفسارات خلال 24 ساعة عمل. انضم إلى ثورة الذكاء الاصطناعي اليوم.
                 </p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">الاسم</label>
                <input 
                  type="text" 
                  id="name"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-labPrimary focus:ring-1 focus:ring-labPrimary transition-all"
                  placeholder="اسمك الكريم"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  id="email"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-labPrimary focus:ring-1 focus:ring-labPrimary transition-all"
                  placeholder="example@domain.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">الرسالة</label>
                <textarea 
                  id="message"
                  rows={4}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-labPrimary focus:ring-1 focus:ring-labPrimary transition-all"
                  placeholder="كيف يمكننا مساعدتك؟"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-labPrimary to-labSecondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span>إرسال</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
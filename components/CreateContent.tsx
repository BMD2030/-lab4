import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const CreateContent: React.FC = () => {
  return (
    <section id="create" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-labPrimary/10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="lg:w-1/2 text-right">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-labPrimary/20 text-labPrimary border border-labPrimary/30 mb-6">
              <Sparkles className="w-4 h-4 ml-2" />
              <span className="text-sm font-semibold">المستقبل بين يديك</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              اصنع محتواك <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-labPrimary to-labSecondary">
                بلا حدود وبلا قيود
              </span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              منصة Lab4 تمكنك من دمج الإبداع البشري مع قوة الخوارزميات. سواء كنت صانع محتوى، مسوق، أو صاحب عمل، أدواتنا مصممة لتسريع إنتاجيتك ورفع جودة مخرجاتك.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                'واجهة مستخدم سهلة وداعمة للغة العربية',
                'سرعة فائقة في المعالجة والتوليد',
                'دقة عالية في النتائج ومطابقة للسياق',
                'تكامل مع منصات النشر المفضلة لديك'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-labSecondary ml-3"></div>
                  {item}
                </li>
              ))}
            </ul>

            <button className="bg-white text-labDark px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center group">
              ابدأ رحلة الإبداع
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-4 shadow-2xl shadow-labPrimary/20">
              {/* Mock Interface */}
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="mr-auto text-xs text-gray-500">Lab4 Studio</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                   <div className="w-1/3 h-32 bg-white/5 rounded-lg animate-pulse"></div>
                   <div className="w-2/3 space-y-3">
                      <div className="h-4 bg-white/10 rounded w-3/4"></div>
                      <div className="h-4 bg-white/10 rounded w-1/2"></div>
                      <div className="h-20 bg-white/5 rounded w-full mt-2 border border-labPrimary/30 flex items-center justify-center text-labPrimary/50 text-sm">
                        جاري التوليد...
                      </div>
                   </div>
                </div>
                <div className="bg-labDark p-4 rounded-lg border border-white/5">
                   <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>الموجه (Prompt)</span>
                      <span>120/500</span>
                   </div>
                   <p className="text-gray-300 text-sm">
                      اكتب سيناريو إعلاني لمنتج قهوة جديد يركز على النشاط والحيوية في الصباح...
                   </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
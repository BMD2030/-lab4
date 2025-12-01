import React from 'react';
import { Users, Target, Globe } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-labDark to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">من نحن</h2>
          <div className="w-24 h-1 bg-labSecondary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">
            <div className="w-16 h-16 bg-labPrimary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-labPrimary">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">فريق شغوف</h3>
            <p className="text-gray-400 leading-relaxed">
              نحن مجموعة من المهندسين والمبدعين نؤمن بأن الذكاء الاصطناعي هو الشريك الأمثل للإبداع البشري وليس بديلاً عنه.
            </p>
          </div>

          <div className="text-center p-8 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm transform md:-translate-y-4 relative z-10 shadow-xl shadow-purple-900/20">
            <div className="w-16 h-16 bg-labSecondary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-labSecondary">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">رؤيتنا</h3>
            <p className="text-gray-400 leading-relaxed">
              تمكين صناع المحتوى في العالم العربي من الوصول إلى أحدث تقنيات الذكاء الاصطناعي التوليدي لإنتاج محتوى عالمي المستوى.
            </p>
          </div>

          <div className="text-center p-8 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">أثرنا</h3>
            <p className="text-gray-400 leading-relaxed">
              نساهم في إثراء المحتوى العربي الرقمي وندعم التحول الرقمي في المملكة العربية السعودية والمنطقة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
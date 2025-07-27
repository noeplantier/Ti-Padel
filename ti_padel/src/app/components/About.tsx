import { Card, CardContent } from '@/components/ui/card';
import { Award, Heart, Shield, Waves } from 'lucide-react';

export function About() {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Instructeurs certifiés et expérience premium'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Amour authentique des sports nautiques'
    },
    {
      icon: Shield,
      title: 'Sécurité',
      description: 'Équipements professionnels et protocoles stricts'
    },
    {
      icon: Waves,
      title: 'Tradition',
      description: 'Héritage maritime breton respecté'
    }
  ];

  return (
    <section id="propos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-black mb-6">
              L'esprit Ti Paddle
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Ancrés dans la tradition maritime bretonne, nous partageons notre passion du paddle sport 
              depuis plus de 10 ans. Notre école, située sur les magnifiques côtes bretonnes, 
              offre un cadre exceptionnel pour découvrir ou perfectionner cette discipline.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Que vous soyez débutant ou confirmé, nos instructeurs certifiés vous accompagnent 
              dans votre progression avec bienveillance et expertise technique.
            </p>
            <div className="bg-black/5 rounded-lg p-6">
              <h3 className="font-semibold text-black mb-2">Notre engagement</h3>
              <p className="text-gray-600">
                Transmission de la culture maritime bretonne à travers une approche moderne 
                et sécurisée du paddle sport.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 p-3 bg-black/5 rounded-full w-fit">
                    <value.icon className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="font-semibold text-black mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
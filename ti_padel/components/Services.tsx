import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Handshake , Beef, Cake} from 'lucide-react';


export function Services() {
  const services = [
    {
      icon: Users,
      title: 'Padel entre amis',
      description: 'Sessions en groupe pour apprendre ensemble dans une ambiance conviviale.',
      features: ['Groupe de 6 max', 'Équipement inclus', 'Tous niveaux']
    },
    {
      icon: Beef,
      title: 'Petite restauration',
      description: 'Restauration rapide et saine pour reprendre des forces après le jeu.',
      features: ['Nourriture de qualité', 'Boissons fraîches', 'Ambiance conviviale']
    },
    {
      icon: Handshake,
      title: 'Séminaires d\'entreprise',
      description: 'Ateliers de team building pour renforcer la cohésion d\'équipe.',
      features: ['Coach expérimenté', 'Conseils sportifs', 'Collation incluse']
    },
    {
      icon: Cake,
      title: 'Évènements',
      description: 'Organisation d\'événements privés ou d\'anniversaires sur mesure.',
      features: ['Activités variées', 'Tarifs de groupes', 'Décoration personnalisée']
    }
  ];

  return (
    <section id="services" className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-black mb-4">Nos Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des services optimisés pour vous offrir la meilleure expérience de Padel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-black/5 rounded-full w-fit group-hover:bg-black/10 transition-colors duration-300">
                  <service.icon className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-xl font-bold text-black mb-2">{service.title}</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">

                
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
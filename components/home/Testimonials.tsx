import { Card } from '../ui/card'
import { Star } from 'lucide-react'

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Patient Testimonials</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from patients who have received care at our clinic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                quote:
                  "Dr. Ahuja's compassionate approach and expertise gave me hope during my treatment. His detailed explanations and attention to detail made all the difference in my recovery journey.",
                rating: 5,
              },
              {
                name: "Rajesh Kumar",
                quote:
                  "The personalized treatment plan and constant support from the entire team was exceptional. I felt cared for at every step and highly recommend Excellence Oncology.",
                rating: 5,
              },
              {
                name: "Priya Sharma",
                quote:
                  "Dr. Ahuja's expertise combined with the modern facilities provided the best treatment experience. The follow-up care has been outstanding.",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-8 border border-border bg-white hover:shadow-md transition">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">Verified Patient</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Testimonials

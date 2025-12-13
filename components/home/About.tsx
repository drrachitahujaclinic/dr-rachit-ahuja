import { Users, Award, HeartPulse, Stethoscope } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50/40 overflow-hidden"
    >
      {/* Background Accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[15%] right-[5%] w-36 h-36 sm:w-48 sm:h-48 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[5%] left-[5%] w-40 h-40 sm:w-64 sm:h-64 bg-blue-300/20 rounded-full blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — Doctor Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative group w-full max-w-xs sm:max-w-sm md:max-w-md">
              {/* Glow */}
              <div className="absolute inset-0 bg-blue-200/30 blur-xl rounded-3xl scale-110 opacity-50"></div>

              <div className="relative w-full h-[360px] sm:h-[440px] rounded-3xl overflow-hidden shadow-xl border border-blue-100">
                <img
                  src={`${process.env.NEXT_PUBLIC_AWS_URL}/uploads/doctor-holding-stethoscope-arm.jpg`}
                  alt="Dr. Rachit Ahuja"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white shadow-lg border border-gray-100 px-5 py-3 sm:px-7 sm:py-4 rounded-2xl text-center">
                <p className="text-2xl sm:text-3xl font-bold text-primary">15+</p>
                <p className="text-[10px] sm:text-xs text-gray-600 uppercase">Years Exp.</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Bio */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6">
              About <span className="text-primary">Dr. Rachit Ahuja</span>
            </h2>

            <div className="space-y-4 sm:space-y-5 text-gray-700 text-base sm:text-lg leading-relaxed mb-8">
              <p>
                Dr. Rachit Ahuja is a senior medical oncologist with{" "}
                <strong className="text-gray-900">15+ years of experience</strong> in
                modern cancer treatment and patient-centered care.
              </p>

              <p>
                He specializes in chemotherapy, targeted therapy, immunotherapy,
                and personalized oncology plans designed for individualized healing.
              </p>

              <p>
                Having treated{" "}
                <strong className="text-gray-900">over 1,000 patients</strong>, he
                is known for his evidence-based approach and compassionate care.
              </p>
            </div>

            {/* Stats — Mobile stacks vertically */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {/* STAT 1 */}
              <div className="bg-white shadow rounded-xl p-4 sm:p-5 border border-blue-100 text-center">
                <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 text-primary mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">1000+</p>
                <p className="text-[10px] sm:text-sm text-gray-600 font-medium">Patients</p>
              </div>

              {/* STAT 2 */}
              <div className="bg-white shadow rounded-xl p-4 sm:p-5 border border-blue-100 text-center">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-primary mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">15+ yrs</p>
                <p className="text-[10px] sm:text-sm text-gray-600 font-medium">Experience</p>
              </div>

              {/* STAT 3 */}
              <div className="bg-white shadow rounded-xl p-4 sm:p-5 border border-blue-100 text-center">
                <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 text-primary mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">2</p>
                <p className="text-[10px] sm:text-sm text-gray-600 font-medium">Clinics</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

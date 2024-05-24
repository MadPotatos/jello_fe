import Image from "next/image";

import React from "react";
import { useTranslations } from "next-intl";

const FeaturesPage: React.FC = () => {
  const t = useTranslations("Features");

  return (
    <section
      id="features"
      className="p-20 bg-gradient-to-b from-white to-blue-200"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">{t("discoverFeatures")}</h1>
          <p className="text-xl mb-8">{t("exploreFeatures")}</p>
        </div>

        <div className="flex flex-wrap justify-between">
          <div className="flex flex-col w-full lg:w-1/2 mb-10">
            {/* Feature Section 1 */}
            <div className="feature-section mb-8 flex items-center">
              <div className="flex-grow mr-4">
                <h2 className="text-3xl font-bold mb-4">
                  {t("taskManagement")}
                </h2>
                <p className="text-lg">{t("taskManagementDescription")}</p>
              </div>
              <Image
                src="/images/feature1.png"
                alt="Feature 1"
                width={400}
                height={300}
              />
            </div>

            {/* Feature Section 2 */}
            <div className="feature-section mb-8 flex items-center">
              <div className="flex-grow mr-4">
                <h2 className="text-3xl font-bold mb-4">
                  {t("collaboration")}
                </h2>
                <p className="text-lg">{t("collaborationDescription")}</p>
              </div>
              <Image
                src="/images/feature2.png"
                alt="Feature 2"
                width={400}
                height={300}
              />
            </div>
          </div>

          {/* Feature Section 3 */}
          <div className="feature-section mb-10 flex items-center w-full lg:w-1/2">
            <div className="flex-grow ml-4">
              <h2 className="text-3xl font-bold mb-4">{t("analytics")}</h2>
              <p className="text-lg">{t("analyticsDescription")}</p>
            </div>
            <Image
              src="/images/feature3.png"
              alt="Feature 3"
              width={400}
              height={300}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesPage;

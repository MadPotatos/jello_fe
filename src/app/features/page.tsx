'use client';
import { Button } from 'antd';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const FeaturesPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGetStartedClick = () => {
    router.push(`/projects/${session?.user.id}`);
  };

  return (
    <section id="features" className="p-20 bg-gradient-to-b from-white to-purple-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">Discover Jello's Features</h1>
          <p className="text-xl mb-8">
            Explore the powerful features of Jello designed to streamline your team's workflow and boost productivity.
          </p>
        </div>

        <div className="flex flex-wrap justify-between">
          <div className="flex flex-col w-full lg:w-1/2 mb-10">
            {/* Feature Section 1 */}
            <div className="feature-section mb-8 flex items-center">
              <div className="flex-grow mr-4">
                <h2 className="text-3xl font-bold mb-4">Task Management</h2>
                <p className="text-lg">
                  Take control of your workload with intuitive task lists, prioritization tools, and progress tracking.
                  Easily assign tasks, set deadlines, and collaborate with your team in real-time.
                </p>
              </div>
              <Image src="/images/feature1.png" alt="Feature 1" width={400} height={300} />
            </div>

            {/* Feature Section 2 */}
            <div className="feature-section mb-8 flex items-center">
              <div className="flex-grow mr-4">
                <h2 className="text-3xl font-bold mb-4">Collaboration</h2>
                <p className="text-lg">
                  Foster seamless communication and teamwork with built-in chat, file sharing, and @mentions.
                  Stay on top of project updates and discussions, keeping everyone in the loop.
                </p>
              </div>
              <Image src="/images/feature2.png" alt="Feature 2" width={400} height={300} />
            </div>
          </div>

          {/* Feature Section 3 */}
          <div className="feature-section mb-10 flex items-center w-full lg:w-1/2">
            <div className="flex-grow ml-4">
              <h2 className="text-3xl font-bold mb-4">Analytics</h2>
              <p className="text-lg">
                Gain valuable insights into team performance and project progress with comprehensive analytics.
                Track key metrics, identify bottlenecks, and make data-driven decisions to optimize your workflow.
              </p>
            </div>
            <Image src="/images/feature3.png" alt="Feature 3" width={400} height={300} />
          </div>
        </div>

  
      </div>
    </section>
  );
};

export default FeaturesPage;

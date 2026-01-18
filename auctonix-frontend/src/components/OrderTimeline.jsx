import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const steps=[
  {key:"PENDING_CONFIRMATION",label:"Order Placed"},
  {key:"CONFIRMED",label:"Order Confirmed"},
  {key:"PAID",label:"Payment Completed"},
  {key:"DELIVERED",label:"Delivered"},
];

export default function OrderTimeline({status}){
  const activeIndex=steps.findIndex(s=>s.key===status);
  const progressPercent=
    activeIndex>=0
      ? (activeIndex / (steps.length - 1)) * 100
      : 0;

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-6 text-[#0b2a55]">Order Progress</h3>

      <div className="relative">

        <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 rounded" />


        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6 }}
          className="absolute top-5 left-0 h-1 bg-green-500 rounded"
        />


        <div className="flex justify-between">
          {steps.map((step, index) => {
            const active = index <= activeIndex;

            return (
              <div key={step.key} className="flex flex-col items-center">


                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10
                    ${active ? "bg-green-500" : "bg-gray-300"}`}
                >
                  {active && <CheckCircle className="text-white" size={20} />}
                </motion.div>

                {/* LABEL */}
                <p className="text-xs text-center mt-3 w-24">
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export function CreateAuction() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  // const user=storedUser ? JSON.parse(storedUser) : null;
  let user = null;
  try {
    user = storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;
  }
  catch {
    user = null;
  }

  const userId = user?.id;

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const [agreements, setAgreements] = useState({
    detailsTrue: false,
    sellCommitment: false,
    noRetreat: false,
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    startDate: "",
    endDate: "",
  });

  const allAgreed = Object.values(agreements).every(Boolean);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAgreement = (e) =>
    setAgreements({ ...agreements, [e.target.name]: e.target.checked });

  const handleImage = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End date must be greater than or equal to start date");
      return;
    }
    try {
      const imgForm = new FormData();
      imgForm.append("file", image);

      const imgRes = await api.post("api/upload/image", imgForm, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const pdfForm = new FormData();
      pdfForm.append("file", pdf);

      const pdfRes = await api.post("api/upload/pdf", pdfForm, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const productRes = await api.post(
        `api/products/add?ownerId=${userId}&imageUrl=${imgRes.data}&pdfUrl=${pdfRes.data}`,
        {
          name: form.name,
          description: form.description,
          category: form.category,
          basePrice: form.basePrice,
        }
      );

      await api.post("api/auctions/create", null, {
        params: {
          productId: productRes.data.id,
          startTime: `${form.startDate}T00:00:00`,
          endTime: `${form.endDate}T23:59:59`,
        },
      });

      // await api.post("/auctions/create", {
      //   productId: productRes.data.id,
      //   startTime: `${form.startDate}T00:00:00`,
      //   endTime: `${form.endDate}T23:59:59`,
      // });


      setSuccess(true);
    }
    catch (err) {
      console.error(err);
      alert("Failed to create auction");
    }
  };

  const isFormValid =
    form.name &&
    form.description &&
    form.category &&
    form.basePrice &&
    form.startDate &&
    form.endDate &&
    image &&
    pdf &&
    allAgreed;


  return (
    <section className="bg-gray-50 min-h-screen py-10 sm:py-14 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* TITLE */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0b2a55]">
            Create <span className="text-yellow-400">Auction</span>
          </h2>
          <div className="flex justify-center mt-3">
            <span className="h-[3px] w-24 bg-yellow-400"></span>
          </div>
          <p className="text-gray-600 mt-4">
            Provide accurate details to build buyer trust
          </p>
        </div>

        {/* TIPS (TOP) */}
        <div className="bg-white border-l-4 border-yellow-400
                rounded-2xl p-6 mb-10 shadow-lg">

          <h4 className="text-xl font-bold text-[#0b2a55] mb-4 flex items-center gap-2">
            💡 Auction Success Tips
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">

            <div className="flex gap-3">
              <span>📸</span>
              <p>Upload high-resolution images to attract more bidders</p>
            </div>

            <div className="flex gap-3">
              <span>📝</span>
              <p>Write clear and honest descriptions to build trust</p>
            </div>

            <div className="flex gap-3">
              <span>💰</span>
              <p>Set a competitive starting price to increase participation</p>
            </div>

            <div className="flex gap-3">
              <span>⏳</span>
              <p>Longer auctions usually receive more bids</p>
            </div>

            <div className="flex gap-3">
              <span>📄</span>
              <p>Upload proper documents to gain buyer confidence</p>
            </div>

            <div className="flex gap-3">
              <span>🔔</span>
              <p>Auctions starting today get higher visibility</p>
            </div>

            <div className="flex gap-3">
              <span>⚠️</span>
              <p>Once started, auction details cannot be edited</p>
            </div>

            <div className="flex gap-3">
              <span>🏆</span>
              <p>Popular categories tend to close at higher prices</p>
            </div>

          </div>
        </div>


        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 space-y-6
                        border-l-4 border-yellow-400">

          {/* ITEM NAME */}
          <div>
            <label className="text-sm font-medium text-[#0b2a55]">
              Item Name *
            </label>
            <input
              name="name"
              className="w-full border rounded-lg px-4 py-3 mt-1"
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-[#0b2a55]">
              Item Description *
            </label>
            <textarea
              name="description"
              rows="4"
              className="w-full border rounded-lg px-4 py-3 mt-1"
              onChange={handleChange}
            />
          </div>

          {/* CATEGORY & PRICE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#0b2a55]">
                Category *
              </label>
              <select
                name="category"
                className="w-full border rounded-lg px-4 py-3 mt-1"
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option>Electronics</option>
                <option>Art</option>
                <option>Fashion</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#0b2a55]">
                Starting Price (₹) *
              </label>
              <input
                type="number"
                name="basePrice"
                className="w-full border rounded-lg px-4 py-3 mt-1"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* FILE UPLOADS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#0b2a55]">
                Product Image *
              </label>
              <input
                type="file"
                accept="image/*"
                className="mt-1"
                onChange={(e) => handleImage(e.target.files[0])}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#0b2a55]">
                Product Document (PDF) *
              </label>
              <input
                type="file"
                accept="application/pdf"
                className="mt-1"
                onChange={(e) => setPdf(e.target.files[0])}
              />
            </div>
          </div>

          {preview && (
            <img
              src={preview}
              className="h-36 sm:h-44 rounded-lg object-cover shadow"
              alt="Preview"
            />
          )}

          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#0b2a55]">
                Auction Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                className="w-full border rounded-lg px-4 py-3 mt-1"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#0b2a55]">
                Auction End Date *
              </label>
              <input
                type="date"
                name="endDate"
                min={form.startDate}
                className="w-full border rounded-lg px-4 py-3 mt-1"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* AGREEMENTS */}
          <div className="bg-gray-50 rounded-xl p-5 text-sm space-y-3">
            {[
              ["detailsTrue", "I confirm all provided details are true"],
              ["sellCommitment", "I agree to sell at the winning bid price"],
              ["noRetreat", "I will not retreat after auction completion"],
            ].map(([key, label]) => (
              <label key={key} className="flex gap-2">
                <input
                  type="checkbox"
                  name={key}
                  onChange={handleAgreement}
                />
                {label}
              </label>
            ))}
          </div>

          {/* SUBMIT */}
          <button
            disabled={!isFormValid}
            onClick={handleSubmit}
            className={`w-full py-3 rounded-lg font-semibold transition ${isFormValid
                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Create Auction
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-5 sm:p-8 text-center shadow-xl w-[92vw] max-w-md">
            <h3 className="text-2xl font-bold text-[#0b2a55] mb-3">
              🎉 Auction Created Successfully
            </h3>
            <p className="text-gray-600 mb-6">
              Your auction is now visible to bidders
            </p>
            <button
              onClick={() => navigate("/my-auctions")}
              className="bg-yellow-400 px-6 py-2 rounded font-semibold"
            >
              Go to My Auctions
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
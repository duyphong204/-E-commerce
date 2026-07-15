import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { X, RotateCcw } from "lucide-react"

const FilterSlideBar = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    })

    const [priceRange, setPriceRange] = useState([0, 100])
    const categories = ["Top Wear", "Bottom Wear"]
    const colors = [
        "Red",
        "Blue",
        "Black",
        "Green",
        "Yellow",
        "Gray",
        "White",
        "Pink",
        "Beige",
        "Navy"
    ]
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
    const materials = [
        "Cotton",
        "Len",
        "Denim",
        "Polyester",
        "Lụa",
        "Linen",
    ]
    const brands = [
        "Urban Threads",
        "Modern Fit",
        "Street Style",
        "Beach Breeze",
        "Fashionista",
        "ChicStyle"
    ]
    const genders = ["Men", "Women"]

    useEffect(() => {
        const params = Object.fromEntries([...searchParams])

        setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: Number(params.minPrice) || 0,
            maxPrice: Number(params.maxPrice) || 100
        })

        setPriceRange([0, Number(params.maxPrice) || 100])
    }, [searchParams])

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target
        let newFilters = { ...filters }
        if (type === "checkbox") {
            if (checked) {
                newFilters[name] = [...(newFilters[name] || []), value]
            } else {
                newFilters[name] = newFilters[name].filter((item) => item !== value)
            }
        } else {
            newFilters[name] = value
        }
        setFilters(newFilters)
        updateURLParams(newFilters)
    }

    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams()
        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(","))
            } else if (newFilters[key] !== "" && newFilters[key] !== 0 && key !== "minPrice") {
                params.append(key, newFilters[key])
            }
        })
        setSearchParams(params)
        navigate(`?${params.toString()}`)
    }

    const handlePriceChange = (e) => {
        const newPrice = Number(e.target.value)
        setPriceRange([0, newPrice])
        const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice }
        setFilters(newFilters)
        updateURLParams(newFilters)
    }

    const handleClearAll = () => {
        const cleared = {
            category: "",
            gender: "",
            color: "",
            size: [],
            material: [],
            brand: [],
            minPrice: 0,
            maxPrice: 100,
        }
        setFilters(cleared)
        setPriceRange([0, 100])
        setSearchParams(new URLSearchParams())
        navigate("?")
    }

    const hasActiveFilters = 
        filters.category !== "" ||
        filters.gender !== "" ||
        filters.color !== "" ||
        filters.size.length > 0 ||
        filters.material.length > 0 ||
        filters.brand.length > 0 ||
        filters.maxPrice !== 100;

    return (
        <div className="space-y-7 pr-2">
            
            {/* Header Lọc */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Bộ lọc</h3>
                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Xóa lọc</span>
                    </button>
                )}
            </div>

            {/* Phân loại (Chips) */}
            <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-800">Danh mục</span>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                        const isSelected = filters.category === category;
                        return (
                            <button
                                type="button"
                                key={category}
                                onClick={() =>
                                    handleFilterChange({
                                        target: { name: "category", value: isSelected ? "" : category }
                                    })
                                }
                                className={`px-3 py-1.5 rounded-xl border text-[11px] font-extrabold uppercase tracking-wide transition-all duration-200 active:scale-95
                                    ${isSelected
                                        ? "bg-gray-950 text-white border-transparent shadow-sm"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-900"
                                    }`}
                            >
                                {category === "Top Wear" ? "Áo" : category === "Bottom Wear" ? "Quần" : category}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Giới tính (Chips) */}
            <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-800">Giới tính</span>
                <div className="flex flex-wrap gap-2">
                    {genders.map((gender) => {
                        const isSelected = filters.gender === gender;
                        return (
                            <button
                                type="button"
                                key={gender}
                                onClick={() =>
                                    handleFilterChange({
                                        target: { name: "gender", value: isSelected ? "" : gender }
                                    })
                                }
                                className={`px-3.5 py-1.5 rounded-xl border text-[11px] font-extrabold uppercase tracking-wide transition-all duration-200 active:scale-95
                                    ${isSelected
                                        ? "bg-gray-950 text-white border-transparent shadow-sm"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-900"
                                    }`}
                            >
                                {gender === "Men" ? "Nam" : gender === "Women" ? "Nữ" : gender}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Màu sắc */}
            <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-800">Màu sắc</span>
                <div className="flex flex-wrap gap-2.5">
                    {colors.map((color) => {
                        const isSelected = filters.color === color;
                        return (
                            <button
                                key={color}
                                type="button"
                                onClick={() =>
                                    handleFilterChange({
                                        target: { name: "color", value: isSelected ? "" : color }
                                    })
                                }
                                className={`w-7.5 h-7.5 rounded-full border transition-all duration-200 relative flex items-center justify-center hover:scale-110 active:scale-90
                                    ${isSelected ? "ring-2 ring-offset-2 ring-emerald-500 border-transparent" : "border-gray-200"}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            >
                                {isSelected && (
                                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm mix-blend-difference" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Size (Square Chips) */}
            <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-800">Kích thước</span>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                        const isSelected = filters.size.includes(size);
                        return (
                            <button
                                type="button"
                                key={size}
                                onClick={() => {
                                    const newSize = isSelected
                                        ? filters.size.filter((s) => s !== size)
                                        : [...filters.size, size];
                                    const newFilters = { ...filters, size: newSize };
                                    setFilters(newFilters);
                                    updateURLParams(newFilters);
                                }}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl border text-[11px] font-extrabold transition-all duration-200 active:scale-90
                                    ${isSelected
                                        ? "bg-gray-950 text-white border-transparent shadow-sm"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-900"
                                    }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chất liệu (Custom Checkbox) */}
            <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-800">Chất liệu</span>
                <div className="space-y-2.5">
                    {materials.map((material) => {
                        const isSelected = filters.material.includes(material);
                        return (
                            <label key={material} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-500 cursor-pointer group">
                                <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all duration-200
                                    ${isSelected 
                                        ? "bg-emerald-500 border-transparent text-white" 
                                        : "bg-white border-gray-200 group-hover:border-gray-400"}`}
                                >
                                    {isSelected && (
                                        <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    name="material"
                                    value={material}
                                    checked={isSelected}
                                    onChange={handleFilterChange}
                                    className="sr-only"
                                />
                                <span className={`transition-colors duration-200 ${isSelected ? "text-gray-900 font-bold" : "group-hover:text-gray-900"}`}>
                                    {material}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Thương hiệu (Custom Checkbox) */}
            <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-800">Thương hiệu</span>
                <div className="space-y-2.5">
                    {brands.map((brand) => {
                        const isSelected = filters.brand.includes(brand);
                        return (
                            <label key={brand} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-500 cursor-pointer group">
                                <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all duration-200
                                    ${isSelected 
                                        ? "bg-emerald-500 border-transparent text-white" 
                                        : "bg-white border-gray-200 group-hover:border-gray-400"}`}
                                >
                                    {isSelected && (
                                        <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    name="brand"
                                    value={brand}
                                    checked={isSelected}
                                    onChange={handleFilterChange}
                                    className="sr-only"
                                />
                                <span className={`transition-colors duration-200 ${isSelected ? "text-gray-900 font-bold" : "group-hover:text-gray-900"}`}>
                                    {brand}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Khoảng giá */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Giá tối đa</span>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">${priceRange[1]}</span>
                </div>
                <input 
                    type="range" 
                    name="priceRange" 
                    min={0} 
                    max={100}
                    value={priceRange[1]}
                    onChange={handlePriceChange} 
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>$0</span>
                    <span>$100</span>
                </div>
            </div>

        </div>
    )
}

export default FilterSlideBar
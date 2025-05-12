import { Briefcase, Percent, PlusCircle, Gift, ShoppingCart, Receipt, Coffee, Bus, Zap, Home, ShoppingBag, Heart, Film, GraduationCap, HandHeart, Users, FileText, Plane, Crown, MoreHorizontal, Circle } from "lucide-react"

export function getCategoryIcon(category: string) {
  switch (category) {
      // Income categories
      case "เงินเดือน":
      case "โบนัส":
          return <Briefcase className="h-4 w-4" />
      case "ดอกเบี้ย":
      case "เงินปันผล":
          return <Percent className="h-4 w-4" />
      case "รายได้เสริม":
          return <PlusCircle className="h-4 w-4" />
      case "ของขวัญ/ซอง":
          return <Gift className="h-4 w-4" />
      case "ขายของออนไลน์":
          return <ShoppingCart className="h-4 w-4" />
      case "คืนภาษี":
          return <Receipt className="h-4 w-4" />
      
      // Expense categories
      case "อาหาร/เครื่องดื่ม":
          return <Coffee className="h-4 w-4" />
      case "เดินทาง/คมนาคม":
          return <Bus className="h-4 w-4" />
      case "บิลค่าน้ำ/ไฟ/โทรศัพท์":
          return <Zap className="h-4 w-4" />
      case "ค่าเช่าบ้าน/คอนโด":
          return <Home className="h-4 w-4" />
      case "ซื้อของใช้ส่วนตัว":
          return <ShoppingBag className="h-4 w-4" />
      case "สุขภาพ/ยา":
          return <Heart className="h-4 w-4" />
      case "บันเทิง/ดูหนัง/เกม":
          return <Film className="h-4 w-4" />
      case "ช้อปปิ้ง":
          return <ShoppingBag className="h-4 w-4" />
      case "การศึกษา/อบรม":
          return <GraduationCap className="h-4 w-4" />
      case "บริจาค":
          return <HandHeart className="h-4 w-4" />
      case "ค่าใช้จ่ายครอบครัว":
          return <Users className="h-4 w-4" />
      case "ภาษี/ค่าธรรมเนียม":
          return <FileText className="h-4 w-4" />
      case "ท่องเที่ยว":
          return <Plane className="h-4 w-4" />
      case "ฟุ้มเฟือย":
          return <Crown className="h-4 w-4" />
      case "อื่นๆ":
          return <MoreHorizontal className="h-4 w-4" />
      default:
          return <Circle className="h-4 w-4" />
  }
}

export function getCategoryColor(category: string) {
  switch (category) {
      // Income categories
      case "เงินเดือน":
      case "โบนัส":
          return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
      case "ดอกเบี้ย":
      case "เงินปันผล":
          return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
      case "รายได้เสริม":
          return "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300"
      case "ของขวัญ/ซอง":
          return "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300"
      case "ขายของออนไลน์":
          return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
      case "คืนภาษี":
          return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300"
      
      // Expense categories
      case "อาหาร/เครื่องดื่ม":
          return "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
      case "เดินทาง/คมนาคม":
          return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
      case "บิลค่าน้ำ/ไฟ/โทรศัพท์":
          return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
      case "ค่าเช่าบ้าน/คอนโด":
          return "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300"
      case "ซื้อของใช้ส่วนตัว":
          return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
      case "สุขภาพ/ยา":
          return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
      case "บันเทิง/ดูหนัง/เกม":
          return "bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300"
      case "ช้อปปิ้ง":
          return "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900 dark:text-fuchsia-300"
      case "การศึกษา/อบรม":
          return "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300"
      case "บริจาค":
          return "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300"
      case "ค่าใช้จ่ายครอบครัว":
          return "bg-lime-100 text-lime-600 dark:bg-lime-900 dark:text-lime-300"
      case "ภาษี/ค่าธรรมเนียม":
          return "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
      case "ท่องเที่ยว":
          return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300"
      case "ฟุ้มเฟือย":
          return "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
      case "อื่นๆ":
          return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      default:
          return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
  }
} 
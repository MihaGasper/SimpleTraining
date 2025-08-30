"use client"

import { useState } from "react"
import { Settings, Plus, X, Check, Dumbbell, Zap } from "lucide-react"

interface Equipment {
  id: string
  name: string
  category: string
  weight?: string
  resistance?: string
  color?: string
}

interface EquipmentCategory {
  id: string
  name: string
  icon: string
  description: string
  items: Equipment[]
}

const defaultCategories: EquipmentCategory[] = [
  {
    id: "weights",
    name: "Uteži",
    icon: "🏋️",
    description: "Dodajte uteži, ki jih imate doma",
    items: [
      { id: "dumbbell-2kg", name: "Dumbbell", category: "weights", weight: "2kg" },
      { id: "dumbbell-4kg", name: "Dumbbell", category: "weights", weight: "4kg" },
      { id: "dumbbell-6kg", name: "Dumbbell", category: "weights", weight: "6kg" },
      { id: "dumbbell-8kg", name: "Dumbbell", category: "weights", weight: "8kg" },
      { id: "dumbbell-10kg", name: "Dumbbell", category: "weights", weight: "10kg" },
      { id: "dumbbell-12kg", name: "Dumbbell", category: "weights", weight: "12kg" },
      { id: "dumbbell-15kg", name: "Dumbbell", category: "weights", weight: "15kg" },
      { id: "dumbbell-20kg", name: "Dumbbell", category: "weights", weight: "20kg" },
      { id: "kettlebell-8kg", name: "Kettlebell", category: "weights", weight: "8kg" },
      { id: "kettlebell-12kg", name: "Kettlebell", category: "weights", weight: "12kg" },
      { id: "kettlebell-16kg", name: "Kettlebell", category: "weights", weight: "16kg" },
      { id: "kettlebell-20kg", name: "Kettlebell", category: "weights", weight: "20kg" },
      { id: "kettlebell-24kg", name: "Kettlebell", category: "weights", weight: "24kg" },
      { id: "barbell", name: "Barbell", category: "weights", weight: "20kg" },
      { id: "plates-1kg", name: "Plates", category: "weights", weight: "1kg" },
      { id: "plates-2kg", name: "Plates", category: "weights", weight: "2kg" },
      { id: "plates-5kg", name: "Plates", category: "weights", weight: "5kg" },
      { id: "plates-10kg", name: "Plates", category: "weights", weight: "10kg" },
      { id: "plates-15kg", name: "Plates", category: "weights", weight: "15kg" },
      { id: "plates-20kg", name: "Plates", category: "weights", weight: "20kg" },
    ]
  },
  {
    id: "resistance-bands",
    name: "Elastike",
    icon: "🔄",
    description: "Dodajte elastike z različnimi odpornostmi",
    items: [
      { id: "band-light", name: "Elastika", category: "resistance-bands", resistance: "Lahka", color: "Rumena" },
      { id: "band-medium", name: "Elastika", category: "resistance-bands", resistance: "Srednja", color: "Rdeča" },
      { id: "band-heavy", name: "Elastika", category: "resistance-bands", resistance: "Težka", color: "Modra" },
      { id: "band-extra-heavy", name: "Elastika", category: "resistance-bands", resistance: "Zelo težka", color: "Črna" },
      { id: "band-mini", name: "Mini elastika", category: "resistance-bands", resistance: "Mini", color: "Zelena" },
      { id: "band-loop", name: "Loop elastika", category: "resistance-bands", resistance: "Loop", color: "Oranžna" },
    ]
  },
  {
    id: "cardio",
    name: "Kardio oprema",
    icon: "❤️",
    description: "Dodajte kardio opremo",
    items: [
      { id: "jump-rope", name: "Skočna vrv", category: "cardio" },
      { id: "treadmill", name: "Tekača", category: "cardio" },
      { id: "exercise-bike", name: "Kolo", category: "cardio" },
      { id: "rowing-machine", name: "Veslač", category: "cardio" },
      { id: "elliptical", name: "Eliptični", category: "cardio" },
      { id: "stepper", name: "Stepper", category: "cardio" },
    ]
  },
  {
    id: "yoga",
    name: "Joga oprema",
    icon: "🧘",
    description: "Dodajte jogo opremo",
    items: [
      { id: "yoga-mat", name: "Joga preproga", category: "yoga" },
      { id: "yoga-block", name: "Joga blok", category: "yoga" },
      { id: "yoga-strap", name: "Joga trak", category: "yoga" },
      { id: "yoga-bolster", name: "Joga blazina", category: "yoga" },
      { id: "yoga-wheel", name: "Joga kolo", category: "yoga" },
      { id: "yoga-towel", name: "Joga brisača", category: "yoga" },
    ]
  },
  {
    id: "stability",
    name: "Stabilnost",
    icon: "⚖️",
    description: "Dodajte opremo za stabilnost",
    items: [
      { id: "balance-board", name: "Ravnotežna deska", category: "stability" },
      { id: "bosu-ball", name: "BOSU žoga", category: "stability" },
      { id: "stability-ball", name: "Stabilnostna žoga", category: "stability" },
      { id: "foam-roller", name: "Penasti valj", category: "stability" },
      { id: "balance-cushion", name: "Ravnotežna blazina", category: "stability" },
      { id: "wobble-board", name: "Nestabilna deska", category: "stability" },
    ]
  },
  {
    id: "mobility",
    name: "Mobilnost",
    icon: "🔄",
    description: "Dodajte opremo za mobilnost",
    items: [
      { id: "lacrosse-ball", name: "Lacrosse žoga", category: "mobility" },
      { id: "massage-ball", name: "Masažna žoga", category: "mobility" },
      { id: "mobility-stick", name: "Mobilnostna palica", category: "mobility" },
      { id: "stretching-strap", name: "Raztezni trak", category: "mobility" },
      { id: "mobility-band", name: "Mobilnostna elastika", category: "mobility" },
      { id: "trigger-point-tool", name: "Trigger point orodje", category: "mobility" },
    ]
  },
  {
    id: "plyometrics",
    name: "Pliometrija",
    icon: "🚀",
    description: "Dodajte opremo za pliometrijo",
    items: [
      { id: "plyo-box", name: "Pliometrijska skrinja", category: "plyometrics" },
      { id: "agility-ladder", name: "Agilnostna lestev", category: "plyometrics" },
      { id: "hurdles", name: "Prepreke", category: "plyometrics" },
      { id: "speed-cones", name: "Hitrostni stožci", category: "plyometrics" },
      { id: "jump-pad", name: "Skočna blazina", category: "plyometrics" },
      { id: "reaction-ball", name: "Reakcijska žoga", category: "plyometrics" },
    ]
  },
  {
    id: "recovery",
    name: "Obnovitev",
    icon: "🔄",
    description: "Dodajte opremo za obnovitev",
    items: [
      { id: "ice-pack", name: "Led paket", category: "recovery" },
      { id: "heating-pad", name: "Grelna blazina", category: "recovery" },
      { id: "compression-sleeve", name: "Kompresijski rokav", category: "recovery" },
      { id: "massage-gun", name: "Masažna pištola", category: "recovery" },
      { id: "cupping-set", name: "Set za kupanje", category: "cupping" },
      { id: "tens-unit", name: "TENS enota", category: "recovery" },
    ]
  },
  {
    id: "measurement",
    name: "Merjenje",
    icon: "📏",
    description: "Dodajte opremo za merjenje",
    items: [
      { id: "body-fat-caliper", name: "Kaliper za maščobe", category: "measurement" },
      { id: "measuring-tape", name: "Merilni trak", category: "measurement" },
      { id: "body-scale", name: "Telesna tehtnica", category: "measurement" },
      { id: "heart-rate-monitor", name: "Merilec srčnega utripa", category: "measurement" },
      { id: "fitness-tracker", name: "Fitness tracker", category: "measurement" },
      { id: "blood-pressure-monitor", name: "Merilec krvnega tlaka", category: "measurement" },
    ]
  },
  {
    id: "accessories",
    name: "Dodatki",
    icon: "🎯",
    description: "Dodajte različne dodatke",
    items: [
      { id: "gym-gloves", name: "Gimnastične rokavice", category: "accessories" },
      { id: "wrist-wraps", name: "Zapestne ovitke", category: "accessories" },
      { id: "lifting-belt", name: "Dvigovalni pas", category: "accessories" },
      { id: "knee-sleeves", name: "Kolenski rokavi", category: "accessories" },
      { id: "ankle-weights", name: "Gležnjske uteži", category: "accessories" },
      { id: "weight-vest", name: "Utežni jopič", category: "accessories" },
    ]
  }
]

interface EquipmentSelectorProps {
  selectedEquipment: Equipment[]
  onEquipmentChange: (equipment: Equipment[]) => void
  onClose: () => void
}

export default function EquipmentSelector({ selectedEquipment, onEquipmentChange, onClose }: EquipmentSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const toggleEquipment = (equipment: Equipment) => {
    const isSelected = selectedEquipment.some(e => e.id === equipment.id)
    if (isSelected) {
      onEquipmentChange(selectedEquipment.filter(e => e.id !== equipment.id))
    } else {
      onEquipmentChange([...selectedEquipment, equipment])
    }
  }

  const getEquipmentDisplayName = (equipment: Equipment) => {
    if (equipment.weight) {
      return `${equipment.name} ${equipment.weight}`
    }
    if (equipment.resistance) {
      return `${equipment.name} ${equipment.resistance}${equipment.color ? ` (${equipment.color})` : ''}`
    }
    return equipment.name
  }

  const filteredCategories = defaultCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredItems = selectedCategory 
    ? defaultCategories.find(c => c.id === selectedCategory)?.items.filter(item =>
        getEquipmentDisplayName(item).toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    : []

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-border max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Izberite domače pripomočke</h2>
              <p className="text-sm text-muted-foreground">Dodajte opremo, ki jo imate doma</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-border">
          <input
            type="text"
            placeholder="Iskanje po kategorijah ali opremi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="flex h-[500px]">
          {/* Categories */}
          <div className="w-1/3 border-r border-border overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-card-foreground mb-4">Kategorije</h3>
              <div className="space-y-2">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className={`text-xs ${selectedCategory === category.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Equipment Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {selectedCategory ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-card-foreground">
                      {defaultCategories.find(c => c.id === selectedCategory)?.name}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {filteredItems.length} elementov
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {filteredItems.map((item) => {
                      const isSelected = selectedEquipment.some(e => e.id === item.id)
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleEquipment(item)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {getEquipmentDisplayName(item)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.category}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Izberite kategorijo za ogled opreme</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Izbrano: <span className="font-medium text-foreground">{selectedEquipment.length}</span> pripomočkov
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onEquipmentChange([])}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Počisti vse
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white hover:bg-muted/50 text-primary rounded-lg font-medium transition-colors border-2 border-primary/20"
              >
                Potrdi izbiro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

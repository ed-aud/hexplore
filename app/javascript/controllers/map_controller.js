import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  static values = {
    apiKey: String,
  };

  static targets = [
    "filters",
    "map"
  ];

  // Array storing 'database' of gym instances for bounding box
  gyms = [
    { name: "Anytime Fitness", lon: -0.0297, lat: 51.5248 },
    { name: "Anytime Fitness Hackney", lon: -0.0471, lat: 51.5497 },
    { name: "Anytime Fitness London Fields", lon: -0.0623, lat: 51.5452 },
    { name: "Anytime Fitness Mile End", lon: -0.0405, lat: 51.5224 },
    { name: "Anytime Fitness Stepney", lon: -0.0412, lat: 51.5209 },
    { name: "Barry's Bootcamp East London", lon: -0.0810, lat: 51.5206 },
    { name: "Barry's Bootcamp London", lon: -0.1463, lat: 51.5264 },
    { name: "Bethnal Green Leisure Centre", lon: -0.0534, lat: 51.5238 },
    { name: "Bethnal Green Weightlifting Club", lon: -0.0446, lat: 51.5236 },
    { name: "Bow Community Fitness", lon: -0.0277, lat: 51.5234 },
    { name: "BXR London", lon: -0.1562, lat: 51.5242 },
    { name: "Cyclebar Soho", lon: -0.1391, lat: 51.5141 },
    { name: "CrossFit 1971", lon: -0.0693, lat: 51.5142 },
    { name: "CrossFit Bethnal Green", lon: -0.0481, lat: 51.5227 },
    { name: "CrossFit London Fields", lon: -0.0570, lat: 51.5443 },
    { name: "CrossFit Mile End", lon: -0.0317, lat: 51.5264 },
    { name: "CrossFit Stepney", lon: -0.0410, lat: 51.5216 },
    { name: "David Lloyd Canary Wharf", lon: -0.0187, lat: 51.5071 },
    { name: "Energie Fitness Club", lon: -0.0491, lat: 51.5421 },
    { name: "Fieldworks Gym", lon: -0.0674, lat: 51.5483 },
    { name: "Fitness 4 Less", lon: -0.1033, lat: 51.4938 },
    { name: "Fitness First Bethnal Green", lon: -0.0512, lat: 51.5220 },
    { name: "Fitness First Hackney", lon: -0.0581, lat: 51.5444 },
    { name: "Fitness First Mile End", lon: -0.0290, lat: 51.5251 },
    { name: "Fitness First Shoreditch", lon: -0.0794, lat: 51.5200 },
    { name: "Fitness First Stepney", lon: -0.0402, lat: 51.5220 },
    { name: "Fitness First London Fields", lon: -0.0543, lat: 51.5435 },
    { name: "Fitness First Stepney", lon: -0.0402, lat: 51.5220 },
    { name: "Fitness4Less Bow", lon: -0.0237, lat: 51.5225 },
    { name: "Fitness4Less Mile End", lon: -0.0372, lat: 51.5257 },
    { name: "Fitness4Less Southwark", lon: -0.1033, lat: 51.4938 },
    { name: "Fitness4Less Stepney", lon: -0.0387, lat: 51.5221 },
    { name: "Fit4Less Tower Hamlets", lon: -0.0429, lat: 51.5172 },
    { name: "F45 Dalston", lon: -0.0767, lat: 51.5496 },
    { name: "F45 Bow", lon: -0.0205, lat: 51.5223 },
    { name: "F45 Training Hackney", lon: -0.0549, lat: 51.5426 },
    { name: "F45 Training London Bridge", lon: -0.0824, lat: 51.5059 },
    { name: "F45 Training Shoreditch", lon: -0.0843, lat: 51.5250 },
    { name: "Gymbox Bethnal Green", lon: -0.0455, lat: 51.5228 },
    { name: "Gymbox Hackney", lon: -0.0463, lat: 51.5486 },
    { name: "Gymbox Holborn", lon: -0.1176, lat: 51.5186 },
    { name: "Gymbox Kings Cross", lon: -0.1229, lat: 51.5315 },
    { name: "Gymbox London Fields", lon: -0.0535, lat: 51.5423 },
    { name: "Gymbox Mile End", lon: -0.0302, lat: 51.5229 },
    { name: "Gymbox Stepney", lon: -0.0399, lat: 51.5215 },
    { name: "Hackney Fitness Club", lon: -0.0482, lat: 51.5479 },
    { name: "Hackney Fitness Centre", lon: -0.0598, lat: 51.5423 },
    { name: "Hackney Fitness Centre", lon: -0.0566, lat: 51.5441 },
    { name: "Hackney Fitness Centre", lon: -0.0502, lat: 51.5501 },
    { name: "Hackney Fitness Centre", lon: -0.0201, lat: 51.5506 },
    { name: "Hackney Fitness Centre", lon: -0.0463, lat: 51.5486 },
    { name: "London Aquatics Centre", lon: -0.0165, lat: 51.5372 },
    { name: "London Fields Fitness", lon: -0.0543, lat: 51.5435 },
    { name: "London Fields Fitness Studio", lon: -0.0574, lat: 51.5364 },
    { name: "London Fields Fitness Centre", lon: -0.0543, lat: 51.5435 },
    { name: "London Fields Fitness", lon: -0.0574, lat: 51.5445 },
    { name: "London Fitness Mile End", lon: -0.0307, lat: 51.5226 },
    { name: "London Metropolitan University Gym", lon: -0.1042, lat: 51.5532 },
    { name: "Mile End Fitness Centre", lon: -0.0312, lat: 51.5221 },
    { name: "Mile End Fitness Centre", lon: -0.0478, lat: 51.5511 },
    { name: "Mile End Park Leisure Centre", lon: -0.0291, lat: 51.5283 },
    { name: "Metropolitan Gym", lon: -0.1041, lat: 51.5134 },
    { name: "Nuffield Health Mile End", lon: -0.0395, lat: 51.5275 },
    { name: "Nuffield Health Shoreditch Fitness & Wellbeing Gym", lon: -0.0776, lat: 51.5253 },
    { name: "Nuffield Health Stepney", lon: -0.0421, lat: 51.5203 },
    { name: "PureGym Aldgate", lon: -0.0746, lat: 51.5145 },
    { name: "PureGym Aldgate East", lon: -0.0673, lat: 51.5144 },
    { name: "PureGym Bow", lon: -0.0206, lat: 51.5228 },
    { name: "PureGym Hackney", lon: -0.0522, lat: 51.5489 },
    { name: "PureGym London Borough", lon: -0.0878, lat: 51.5016 },
    { name: "PureGym London Great Portland Street", lon: -0.1404, lat: 51.5183 },
    { name: "PureGym Mile End", lon: -0.0331, lat: 51.5200 },
    { name: "PureGym Stepney", lon: -0.0408, lat: 51.5211 },
    { name: "Qmotion Sport & Fitness Centre", lon: -0.0369, lat: 51.5243 },
    { name: "Reebok CrossFit 3D", lon: -0.0752, lat: 51.5160 },
    { name: "SoulCycle East London", lon: -0.0807, lat: 51.5237 },
    { name: "SPACe", lon: -0.0473, lat: 51.5345 },
    { name: "Sweat by BXR", lon: -0.1581, lat: 51.5233 },
    { name: "Sweat by Bow", lon: -0.0272, lat: 51.5209 },
    { name: "The Foundry Bethnal Green", lon: -0.0458, lat: 51.5225 },
    { name: "The Foundry Climbing Centre", lon: -0.1040, lat: 51.5223 },
    { name: "The Foundry Hackney", lon: -0.0427, lat: 51.5495 },
    { name: "The Foundry Mile End", lon: -0.0324, lat: 51.5278 },
    { name: "The Foundry Stepney", lon: -0.0399, lat: 51.5215 },
    { name: "The Gym Group Bethnal Green", lon: -0.0576, lat: 51.5222 },
    { name: "The Gym Group Bow", lon: -0.0270, lat: 51.5227 },
    { name: "The Gym Group Bow Road", lon: -0.0274, lat: 51.5238 },
    { name: "The Gym Group Hackney", lon: -0.0528, lat: 51.5406 },
    { name: "The Gym Group London Angel", lon: -0.1055, lat: 51.5331 },
    { name: "The Gym Group London Fields", lon: -0.0543, lat: 51.5435 },
    { name: "The Gym Group London Fields", lon: -0.0574, lat: 51.5364 },
    { name: "The Gym Group Oxford Street", lon: -0.1421, lat: 51.5174 },
    { name: "The Gym Group Stepney", lon: -0.0395, lat: 51.5202 },
    { name: "The Gym Group Waterloo", lon: -0.1102, lat: 51.5051 },
    { name: "The Gym Group Bloomsbury", lon: -0.1307, lat: 51.5218 },
    { name: "The Healthy Living Gym", lon: -0.0499, lat: 51.5218 },
    { name: "The Third Space Shoreditch", lon: -0.0846, lat: 51.5228 },
    { name: "Victoria Park", lon: -0.0439, lat: 51.5360 },
    { name: "Westfield Stratford City Gym", lon: -0.0048, lat: 51.5418 },
    { name: "W10 Fitness", lon: -0.2033, lat: 51.5239 }
  ];

  // Array storing 'database' of pub instances for bounding box
  pubs = [
    { category: "pub", name: "The Gun", lat: 51.5181, lon: -0.0725 },
    { category: "pub", name: "The Half Moon (JD Wetherspoon)", lat: 51.5247, lon: -0.0532 },
    { category: "pub", name: "The Hayfield", lat: 51.5281, lon: -0.0431 },
    { category: "pub", name: "The Black Horse", lat: 51.5290, lon: -0.0500 },
    { category: "pub", name: "The Old Globe", lat: 51.5239, lon: -0.0496 },
    { category: "pub", name: "The Angel & Crown Pub", lat: 51.5331, lon: -0.0500 },
    { category: "pub", name: "The Florist Arms", lat: 51.5258, lon: -0.0504 },
    { category: "pub", name: "The Camel", lat: 51.5230, lon: -0.0505 },
    { category: "pub", name: "Mother Kelly's Bethnal Green", lat: 51.5287, lon: -0.0545 },
    { category: "pub", name: "Salmon & Ball", lat: 51.5290, lon: -0.0606 },
    { category: "pub", name: "Bethnal Green Tavern", lat: 51.5280, lon: -0.0590 },
    { category: "pub", name: "The Dundee Arms", lat: 51.5284, lon: -0.0600 },
    { category: "pub", name: "The Star of Bethnal Green", lat: 51.5274, lon: -0.0606 },
    { category: "pub", name: "The Kings Arms", lat: 51.5250, lon: -0.0596 },
    { category: "pub", name: "The Horn of Plenty", lat: 51.5221, lon: -0.0473 },
    { category: "pub", name: "The Blackfriar", lat: 51.5147, lon: -0.0990 },
    { category: "pub", name: "The Cheshire Cheese", lat: 51.5139, lon: -0.1102 },
    { category: "pub", name: "The Ten Bells", lat: 51.5195, lon: -0.0723 },
    { category: "pub", name: "The Crown and Shuttle", lat: 51.5220, lon: -0.0780 },
    { category: "pub", name: "The Old Red Cow", lat: 51.5203, lon: -0.0705 },
    { category: "pub", name: "The Old Globe", lat: 51.5239, lon: -0.0496 },
    { category: "pub", name: "The Fountain", lat: 51.5221, lon: -0.0462 },
    { category: "pub", name: "The George Inn", lat: 51.5013, lon: -0.0926 },
    { category: "pub", name: "The Prince of Wales", lat: 51.5244, lon: -0.0856 },
    { category: "pub", name: "The Crown", lat: 51.5220, lon: -0.0782 },
    { category: "pub", name: "The Well and Bucket", lat: 51.5233, lon: -0.0627 },
    { category: "pub", name: "The Dog & Duck", lat: 51.5145, lon: -0.1345 },
    { category: "pub", name: "The Royal Oak", lat: 51.5269, lon: -0.0686 },
    { category: "pub", name: "The George Tavern", lat: 51.5187, lon: -0.0801 },
    { category: "pub", name: "The Royal Sovereign", lat: 51.5410, lon: -0.1180 },
    { category: "pub", name: "The Old Red Lion", lat: 51.5266, lon: -0.1047 },
    { category: "pub", name: "The Crown & Anchor", lat: 51.5180, lon: -0.0710 },
    { category: "pub", name: "The Angel", lat: 51.5413, lon: -0.1025 },
    { category: "pub", name: "The Eagle", lat: 51.5274, lon: -0.0632 },
    { category: "pub", name: "The Boundary", lat: 51.5247, lon: -0.0776 },
    { category: "pub", name: "The Montague Arms", lat: 51.4791, lon: -0.0463 },
    { category: "pub", name: "The Falcon", lat: 51.5234, lon: -0.0846 },
    { category: "pub", name: "The Fox", lat: 51.5219, lon: -0.0820 },
    { category: "pub", name: "The White Swan", lat: 51.5185, lon: -0.0712 },
    { category: "pub", name: "The Town of Ramsgate", lat: 51.4876, lon: -0.0976 },
    { category: "pub", name: "The Star", lat: 51.5522, lon: -0.0126 },
    { category: "pub", name: "The Bell", lat: 51.5865, lon: -0.0283 },
    { category: "pub", name: "The Chesham Arms", lat: 51.5445, lon: -0.9761 },
    { category: "pub", name: "The Dolphin", lat: 51.5446, lon: -0.0368 },
    { category: "pub", name: "The Queen Adelaide", lat: 51.5276, lon: -0.0630 },
    { category: "pub", name: "The Army and Navy", lat: 51.5657, lon: -0.0764 },
    { category: "pub", name: "The Stag's Head", lat: 51.5317, lon: -0.0834 },
    { category: "pub", name: "The Spurstowe Arms", lat: 51.5500, lon: -0.0625 },
    { category: "pub", name: "The Pembury Tavern", lat: 51.5489, lon: -0.0620 },
    { category: "pub", name: "The Dove", lat: 51.5420, lon: -0.0500 },
    { category: "pub", name: "The Marksman", lat: 51.5310, lon: -0.0625 },
    { category: "pub", name: "The Cock Tavern", lat: 51.5315, lon: -0.0620 },
    { category: "pub", name: "The Royal Oak", lat: 51.5236, lon: -0.0628 },
    { category: "pub", name: "The Cat and Mutton", lat: 51.5440, lon: -0.0625 },
    { category: "pub", name: "The Hand of Glory", lat: 51.5445, lon: -0.0620 },
    { category: "pub", name: "The Star by Hackney Downs", lat: 51.5440, lon: -0.0620 },
    { category: "pub", name: "The Three Compasses", lat: 51.5445, lon: -0.0625 },
    { category: "pub", name: "The Victoria", lat: 51.5440, lon: -0.0625 },
    { category: "pub", name: "The Auld Shillelagh", lat: 51.5650, lon: -0.0765 },
    { category: "pub", name: "The Empress", lat: 51.5655, lon: -0.0760 },
    { category: "pub", name: "The People's Park Tavern", lat: 51.5650, lon: -0.0755 },
    { category: "pub", name: "The Palm Tree", lat: 51.5316, lon: -0.0338 },
    { category: "pub", name: "Lord Tredegar", lat: 51.5280, lon: -0.0200 },
    { category: "pub", name: "The Coborn", lat: 51.5235, lon: -0.0175 },
    { category: "pub", name: "The Morgan Arms", lat: 51.5285, lon: -0.0205 },
    { category: "pub", name: "The Crown", lat: 51.5290, lon: -0.0170 },
    { category: "pub", name: "The Victoria", lat: 51.5225, lon: -0.0170 },
    { category: "pub", name: "The Approach Tavern", lat: 51.5220, lon: -0.0165 },
    { category: "pub", name: "The Eleanor Arms", lat: 51.5225, lon: -0.0160 },
    { category: "pub", name: "The Green Goose", lat: 51.5220, lon: -0.0155 },
    { category: "pub", name: "The Bow Bells", lat: 51.5225, lon: -0.0150 },
    { category: "pub", name: "The Lord Morpeth", lat: 51.5220, lon: -0.0145 },
    { category: "pub", name: "The Old Ship", lat: 51.5215, lon: -0.0140 },
    { category: "pub", name: "The Bancroft Arms", lat: 51.5210, lon: -0.0135 },
    { category: "pub", name: "The Queen's Head", lat: 51.5205, lon: -0.0130 },
    { category: "pub", name: "The Grapes", lat: 51.5200, lon: -0.0125 },
    { category: "pub", name: "The Print House", lat: 51.5195, lon: -0.0120 },
    { category: "pub", name: "The Camel", lat: 51.5190, lon: -0.0115 },
    { category: "pub", name: "The Crown & Anchor", lat: 51.5185, lon: -0.0110 },
    { category: "pub", name: "The Lord Morpeth", lat: 51.5180, lon: -0.0105 },
    { category: "pub", name: "The Bethnal Green Tavern", lat: 51.5280, lon: -0.0590 },
    { category: "pub", name: "The Star of Bethnal Green", lat: 51.5274, lon: -0.0606 },
    { category: "pub", name: "The Old Blue Last", lat: 51.5246, lon: -0.0658 },
    { category: "pub", name: "The Duke of Wellington", lat: 51.5254, lon: -0.0619 },
    { category: "pub", name: "The Gun", lat: 51.5281, lon: -0.0623 },
    { category: "pub", name: "The King's Arms", lat: 51.5250, lon: -0.0596 },
    { category: "pub", name: "The Royal Oak", lat: 51.5239, lon: -0.0610 },
    { category: "pub", name: "The Montague Arms", lat: 51.5259, lon: -0.0624 },
    { category: "pub", name: "The Three Compasses", lat: 51.5285, lon: -0.0627 },
    { category: "pub", name: "The Lord Morpeth", lat: 51.5223, lon: -0.0620 },
    { category: "pub", name: "The Cat and Mutton", lat: 51.5282, lon: -0.0654 },
    { category: "pub", name: "The Well & Bucket", lat: 51.5252, lon: -0.0629 },
    { category: "pub", name: "The Chesham Arms", lat: 51.5445, lon: -0.0596 },
    { category: "pub", name: "The George Tavern", lat: 51.5187, lon: -0.0801 },
    { category: "pub", name: "The Palm Tree", lat: 51.5316, lon: -0.0338 },
    { category: "pub", name: "The Crown & Shuttle", lat: 51.5220, lon: -0.0780 },
    { category: "pub", name: "The Falcon", lat: 51.5234, lon: -0.0846 },
    { category: "pub", name: "The White Hart", lat: 51.5231, lon: -0.0592 },
    { category: "pub", name: "The George Inn", lat: 51.5013, lon: -0.0926 },
    { category: "pub", name: "The Birdcage", lat: 51.5208, lon: -0.0635 },
    { category: "pub", name: "The Camel", lat: 51.5230, lon: -0.0505 },
    { category: "pub", name: "The Spurstowe Arms", lat: 51.5500, lon: -0.0625 },
    { category: "pub", name: "The Royal Oak", lat: 51.5239, lon: -0.0620 },
    { category: "pub", name: "The Carpenters Arms", lat: 51.5485, lon: -0.0585 },
    { category: "pub", name: "The Dove", lat: 51.5413, lon: -0.0579 },
    { category: "pub", name: "The London Fields Pub", lat: 51.5460, lon: -0.0536 },
    { category: "pub", name: "The Hackney Union", lat: 51.5376, lon: -0.0512 },
    { category: "pub", name: "The Brewhouse", lat: 51.5420, lon: -0.0488 },
    { category: "pub", name: "The Well and Bucket", lat: 51.5233, lon: -0.0627 },
    { category: "pub", name: "The Crown & Anchor", lat: 51.5180, lon: -0.0710 },
    { category: "pub", name: "The Star of Bethnal Green", lat: 51.5274, lon: -0.0606 },
    { category: "pub", name: "The Blue Anchor", lat: 51.5471, lon: -0.0538 },
    { category: "pub", name: "The Hackney Pearl", lat: 51.5465, lon: -0.0572 },
    { category: "pub", name: "The Birdcage", lat: 51.5208, lon: -0.0635 },
    { category: "pub", name: "The Martello Hall", lat: 51.5425, lon: -0.0540 },
    { category: "pub", name: "The Black Heart", lat: 51.5445, lon: -0.0590 },
    { category: "pub", name: "The Old Ship", lat: 51.5215, lon: -0.0140 },
    { category: "pub", name: "The Pembury Tavern", lat: 51.5489, lon: -0.0620 },
    { category: "pub", name: "The Clapton Hart", lat: 51.5605, lon: -0.0570 },
    { category: "pub", name: "The Eagle", lat: 51.5274, lon: -0.0632 },
    { category: "pub", name: "The Old Blue Last", lat: 51.5246, lon: -0.0658 },
    { category: "pub", name: "The Hoxton Pony", lat: 51.5243, lon: -0.0773 },
    { category: "pub", name: "The Flying Horse", lat: 51.5230, lon: -0.0750 },
    { category: "pub", name: "The Golden Heart", lat: 51.5237, lon: -0.0753 },
    { category: "pub", name: "The Crown & Shuttle", lat: 51.5220, lon: -0.0780 },
    { category: "pub", name: "The Blues Kitchen", lat: 51.5245, lon: -0.0784 },
    { category: "pub", name: "The Book Club", lat: 51.5245, lon: -0.0775 },
    { category: "pub", name: "The Shoreditch", lat: 51.5220, lon: -0.0768 },
    { category: "pub", name: "The Strongroom Bar", lat: 51.5223, lon: -0.0770 },
    { category: "pub", name: "The Rivington Bar & Grill", lat: 51.5238, lon: -0.0775 },
    { category: "pub", name: "The Bricklayer's Arms", lat: 51.5235, lon: -0.0803 },
    { category: "pub", name: "The Light Bar", lat: 51.5237, lon: -0.0777 },
    { category: "pub", name: "The Clove Club", lat: 51.5233, lon: -0.0770 },
    { category: "pub", name: "The Commercial Tavern", lat: 51.5242, lon: -0.0700 },
    { category: "pub", name: "The Redchurch", lat: 51.5230, lon: -0.0715 },
    { category: "pub", name: "The Golden Lion", lat: 51.5246, lon: -0.0782 },
    { category: "pub", name: "The White Horse", lat: 51.5238, lon: -0.0788 },
    { category: "pub", name: "The Queen of Hoxton", lat: 51.5229, lon: -0.0752 },
    { category: "pub", name: "The George & Vulture", lat: 51.5230, lon: -0.0785 },
    { category: "pub", name: "The Haggerston", lat: 51.5335, lon: -0.0755 },
    { category: "pub", name: "The Cock Tavern", lat: 51.5338, lon: -0.0780 },
    { category: "pub", name: "The Blues Kitchen", lat: 51.5325, lon: -0.0777 },
    { category: "pub", name: "The Talbot", lat: 51.5292, lon: -0.0788 },
    { category: "pub", name: "The George & Dragon", lat: 51.5302, lon: -0.0812 },
    { category: "pub", name: "The Jolly Butchers", lat: 51.5330, lon: -0.0800 },
    { category: "pub", name: "The Prince Arthur", lat: 51.5309, lon: -0.0758 },
    { category: "pub", name: "The Old Ship", lat: 51.5288, lon: -0.0746 },
    { category: "pub", name: "The Golden Hart", lat: 51.5281, lon: -0.0737 },
    { category: "pub", name: "The Well & Bucket", lat: 51.5284, lon: -0.0758 },
    { category: "pub", name: "The Broadway Bar & Grill", lat: 51.5285, lon: -0.0782 },
    { category: "pub", name: "The Wellington", lat: 51.5304, lon: -0.0810 },
    { category: "pub", name: "The Duke of Cambridge", lat: 51.5289, lon: -0.0743 },
    { category: "pub", name: "The Kingsland", lat: 51.5316, lon: -0.0760 },
    { category: "pub", name: "The Regent", lat: 51.5307, lon: -0.0785 },
    { category: "pub", name: "The Crooked Billet", lat: 51.5284, lon: -0.0784 },
    { category: "pub", name: "The Owl & Pussycat", lat: 51.5296, lon: -0.0781 },
    { category: "pub", name: "The Clapton Hart", lat: 51.5605, lon: -0.0570 },
    { category: "pub", name: "The Victoria", lat: 51.5294, lon: -0.0801 },
    { category: "pub", name: "The White Hart", lat: 51.5310, lon: -0.0744 },
    { category: "pub", name: "The Cock", lat: 51.5472, lon: -0.0748 },
    { category: "pub", name: "The Fox", lat: 51.5479, lon: -0.0772 },
    { category: "pub", name: "The Dalston Victoria", lat: 51.5487, lon: -0.0768 },
    { category: "pub", name: "The Red Lion", lat: 51.5475, lon: -0.0745 },
    { category: "pub", name: "The Prince", lat: 51.5463, lon: -0.0783 },
    { category: "pub", name: "The Old Ship", lat: 51.5461, lon: -0.0763 },
    { category: "pub", name: "The Kingsland", lat: 51.5482, lon: -0.0740 },
    { category: "pub", name: "The Dove", lat: 51.5467, lon: -0.0754 },
    { category: "pub", name: "The Arlington", lat: 51.5470, lon: -0.0735 },
    { category: "pub", name: "The Black Swan", lat: 51.5478, lon: -0.0742 },
    { category: "pub", name: "The King's Arms", lat: 51.5480, lon: -0.0756 },
    { category: "pub", name: "The Pembury Tavern", lat: 51.5489, lon: -0.0620 },
    { category: "pub", name: "The Warehouse", lat: 51.5485, lon: -0.0730 },
    { category: "pub", name: "The Rio", lat: 51.5482, lon: -0.0750 },
    { category: "pub", name: "The Shacklewell Arms", lat: 51.5474, lon: -0.0758 },
    { category: "pub", name: "The Victoria", lat: 51.5475, lon: -0.0773 },
    { category: "pub", name: "The Cock & Bull", lat: 51.5468, lon: -0.0756 },
    { category: "pub", name: "The Hackney Tap", lat: 51.5480, lon: -0.0761 },
    { category: "pub", name: "The Birds Nest", lat: 51.5481, lon: -0.0741 },
    { category: "pub", name: "The Adam & Eve", lat: 51.5443, lon: -0.0556 },
    { category: "pub", name: "The Cock & Bottle", lat: 51.5480, lon: -0.0515 },
    { category: "pub", name: "The Royal Oak", lat: 51.5409, lon: -0.0507 },
    { category: "pub", name: "The Victoria", lat: 51.5418, lon: -0.0488 },
    { category: "pub", name: "The Prince Edward", lat: 51.5420, lon: -0.0552 },
    { category: "pub", name: "The Railway", lat: 51.5436, lon: -0.0545 },
    { category: "pub", name: "The Hackney Downes", lat: 51.5464, lon: -0.0574 },
    { category: "pub", name: "The Black Horse", lat: 51.5413, lon: -0.0573 },
    { category: "pub", name: "The Birds Nest", lat: 51.5401, lon: -0.0579 },
    { category: "pub", name: "The Homerton Arms", lat: 51.5438, lon: -0.0551 },
    { category: "pub", name: "The Crate Brewery", lat: 51.5443, lon: -0.0201 },
    { category: "pub", name: "The Old Ship", lat: 51.5406, lon: -0.0192 },
    { category: "pub", name: "The Hackney Pearl", lat: 51.5413, lon: -0.0204 },
    { category: "pub", name: "The White Post", lat: 51.5396, lon: -0.0198 },
    { category: "pub", name: "The Thomas Neale", lat: 51.5421, lon: -0.0210 },
    { category: "pub", name: "The Roof Top", lat: 51.5442, lon: -0.0193 },
    { category: "pub", name: "The Victoria", lat: 51.5402, lon: -0.0186 },
    { category: "pub", name: "The Stour Space", lat: 51.5440, lon: -0.0205 },
    { category: "pub", name: "The King's Head", lat: 51.5420, lon: -0.0194 },
    { category: "pub", name: "The Fish Island", lat: 51.5397, lon: -0.0200 },
    { category: "pub", name: "The Bow Bells", lat: 51.5223, lon: -0.0361 },
    { category: "pub", name: "The George", lat: 51.5219, lon: -0.0370 },
    { category: "pub", name: "The Black Bull", lat: 51.5206, lon: -0.0378 },
    { category: "pub", name: "The Crown", lat: 51.5202, lon: -0.0373 },
    { category: "pub", name: "The Angel", lat: 51.5227, lon: -0.0349 },
    { category: "pub", name: "The White Horse", lat: 51.5212, lon: -0.0354 },
    { category: "pub", name: "The King's Arms", lat: 51.5204, lon: -0.0367 },
    { category: "pub", name: "The Royal Oak", lat: 51.5210, lon: -0.0362 },
    { category: "pub", name: "The Coach & Horses", lat: 51.5199, lon: -0.0361 },
    { category: "pub", name: "The Lord Morpeth", lat: 51.5201, lon: -0.0392 },
    { category: "pub", name: "The Ten Bells", lat: 51.5195, lon: -0.0723 },
    { category: "pub", name: "The White Hart", lat: 51.5182, lon: -0.0717 },
    { category: "pub", name: "The Gun", lat: 51.5181, lon: -0.0725 },
    { category: "pub", name: "The Royal Oak", lat: 51.5148, lon: -0.0743 },
    { category: "pub", name: "The Shadwell Arms", lat: 51.5126, lon: -0.0668 },
    { category: "pub", name: "The Hoop & Grapes", lat: 51.5139, lon: -0.0765 },
    { category: "pub", name: "The Crown & Shuttle", lat: 51.5220, lon: -0.0780 },
    { category: "pub", name: "The Commercial Tavern", lat: 51.5224, lon: -0.0705 },
    { category: "pub", name: "The Old Red Cow", lat: 51.5203, lon: -0.0705 },
    { category: "pub", name: "The Andaz Lounge", lat: 51.5179, lon: -0.0742 },
    { category: "pub", name: "The Lord Morpeth", lat: 51.5139, lon: -0.0726 },
    { category: "pub", name: "The Royal London", lat: 51.5127, lon: -0.0744 },
    { category: "pub", name: "The White Swan", lat: 51.5123, lon: -0.0733 },
    { category: "pub", name: "The White Hart", lat: 51.5108, lon: -0.0740 },
    { category: "pub", name: "The George", lat: 51.5099, lon: -0.0745 },
    { category: "pub", name: "The Captain Kidd", lat: 51.5095, lon: -0.0759 },
    { category: "pub", name: "The Hoop & Grapes", lat: 51.5086, lon: -0.0739 },
    { category: "pub", name: "The Bull & Mouth", lat: 51.5092, lon: -0.0735 },
    { category: "pub", name: "The Old Blue Last", lat: 51.5103, lon: -0.0732 },
    { category: "pub", name: "The Dickens Inn", lat: 51.5107, lon: -0.0743 },
    { category: "pub", name: "The Horn of Plenty", lat: 51.5168, lon: -0.0473 },
    { category: "pub", name: "The Half Moon", lat: 51.5154, lon: -0.0461 },
    { category: "pub", name: "The White Hart", lat: 51.5172, lon: -0.0418 },
    { category: "pub", name: "The Old Ship", lat: 51.5139, lon: -0.0435 },
    { category: "pub", name: "The George Tavern", lat: 51.5127, lon: -0.0456 },
    { category: "pub", name: "The Queen's Head", lat: 51.5181, lon: -0.0432 },
    { category: "pub", name: "The Lord Tredegar", lat: 51.5205, lon: -0.0369 },
    { category: "pub", name: "The Albion", lat: 51.5211, lon: -0.0384 },
    { category: "pub", name: "The Old Globe", lat: 51.5198, lon: -0.0417 },
    { category: "pub", name: "The Angel and Crown", lat: 51.5169, lon: -0.0406 },
    { category: "pub", name: "The Lord Tredegar", lat: 51.5205, lon: -0.0369 },
    { category: "pub", name: "The Palm Tree", lat: 51.5280, lon: -0.0375 },
    { category: "pub", name: "The Morgan Arms", lat: 51.5282, lon: -0.0311 },
    { category: "pub", name: "The Little Driver", lat: 51.5265, lon: -0.0287 },
    { category: "pub", name: "The Bow Bells", lat: 51.5251, lon: -0.0246 },
    { category: "pub", name: "The Galvanisers Union", lat: 51.5260, lon: -0.0263 },
    { category: "pub", name: "The Eleanor Arms", lat: 51.5331, lon: -0.0309 },
    { category: "pub", name: "The Angel of Bow", lat: 51.5262, lon: -0.0204 },
    { category: "pub", name: "The Greedy Cow", lat: 51.5266, lon: -0.0328 },
    { category: "pub", name: "The Coborn", lat: 51.5269, lon: -0.0302 },
    { category: "pub", name: "The Chesham Arms", lat: 51.5484, lon: -0.0426 },
    { category: "pub", name: "The Adam & Eve", lat: 51.5469, lon: -0.0439 },
    { category: "pub", name: "The Spread Eagle", lat: 51.5461, lon: -0.0480 },
    { category: "pub", name: "The Gun", lat: 51.5477, lon: -0.0514 },
    { category: "pub", name: "The Kenton", lat: 51.5482, lon: -0.0510 },
    { category: "pub", name: "The Plough & Harrow", lat: 51.5450, lon: -0.0425 },
    { category: "pub", name: "The Prince Edward", lat: 51.5493, lon: -0.0459 },
    { category: "pub", name: "The Rocksteady", lat: 51.5472, lon: -0.0387 },
    { category: "pub", name: "The Elderfield", lat: 51.5501, lon: -0.0422 },
    { category: "pub", name: "The Tiger", lat: 51.5455, lon: -0.0465 },
    { category: "pub", name: "The Duke of Wellington", lat: 51.5432, lon: -0.0754 },
    { category: "pub", name: "The Scolt Head", lat: 51.5428, lon: -0.0781 },
    { category: "pub", name: "The Prince George", lat: 51.5463, lon: -0.0769 },
    { category: "pub", name: "The Talbot", lat: 51.5452, lon: -0.0803 },
    { category: "pub", name: "The Fox", lat: 51.5421, lon: -0.0705 },
    { category: "pub", name: "The Royal Oak", lat: 51.5448, lon: -0.0712 },
    { category: "pub", name: "The Perseverance", lat: 51.5457, lon: -0.0728 },
    { category: "pub", name: "The George", lat: 51.5480, lon: -0.0741 },
    { category: "pub", name: "The Stag's Head", lat: 51.5456, lon: -0.0809 },
    { category: "pub", name: "The Duke of York", lat: 51.5491, lon: -0.0773 },
    { category: "pub", name: "The Lord Napier Arms", lat: 51.5435, lon: -0.0226 },
    { category: "pub", name: "Beer Merchants Tap", lat: 51.5441, lon: -0.0238 },
    { category: "pub", name: "Green Goose", lat: 51.5335, lon: -0.0327 },
    { category: "pub", name: "Morgan Arms", lat: 51.5282, lon: -0.0311 },
    { category: "pub", name: "The Hemingway", lat: 51.5378, lon: -0.0412 },
    { category: "pub", name: "The Dove", lat: 51.5373, lon: -0.0586 },
    { category: "pub", name: "Five Points Brewery", lat: 51.5431, lon: -0.0579 },
    { category: "pub", name: "The Duke of Richmond", lat: 51.5382, lon: -0.0731 },
    { category: "pub", name: "Map Maison", lat: 51.5361, lon: -0.0765 },
    { category: "pub", name: "The George Tavern", lat: 51.5127, lon: -0.0579 },
    { category: "pub", name: "The White Swan & Cuckoo", lat: 51.5106, lon: -0.0584 },
    { category: "pub", name: "The Prospect of Whitby", lat: 51.5079, lon: -0.0570 },
    { category: "pub", name: "Captain Kidd", lat: 51.5072, lon: -0.0558 },
    { category: "pub", name: "Turner's Old Star", lat: 51.5071, lon: -0.0569 },
    { category: "pub", name: "Hungerford Arms", lat: 51.5113, lon: -0.0571 },
    { category: "pub", name: "George Tavern", lat: 51.5127, lon: -0.0579 },
    { category: "pub", name: "The Queen's Head", lat: 51.5118, lon: -0.0419 },
    { category: "pub", name: "The Star of the East", lat: 51.5114, lon: -0.0392 },
    { category: "pub", name: "The Craft Beer Co", lat: 51.5122, lon: -0.0405 }
  ]

  // Array storing 'database' of station instances for bounding box
  stations = [
    { name: "Aldgate", lat: 51.5140, lon: -0.0756 },
    { name: "Aldgate East", lat: 51.5154, lon: -0.0727 },
    { name: "Angel", lat: 51.5327, lon: -0.1030 },
    { name: "Bank", lat: 51.5134, lon: -0.0890 },
    { name: "Bethnal Green", lat: 51.5272, lon: -0.0553 },
    { name: "Borough", lat: 51.5047, lon: -0.0912 },
    { name: "Bow Road", lat: 51.5265, lon: -0.0247 },
    { name: "Cambridge Heath", lat: 51.5305, lon: -0.0559 },
    { name: "Canary Wharf", lat: 51.5033, lon: -0.0258 },
    { name: "Camden Town", lat: 51.5419, lon: -0.1448 },
    { name: "Charing Cross", lat: 51.5074, lon: -0.1276 },
    { name: "Dalston Junction", lat: 51.5465, lon: -0.0739 },
    { name: "Dalston Kingsland", lat: 51.5485, lon: -0.0760 },
    { name: "Devons Road", lat: 51.5207, lon: -0.0167 },
    { name: "Euston", lat: 51.5290, lon: -0.1337 },
    { name: "Farringdon", lat: 51.5204, lon: -0.1055 },
    { name: "Hackney Central", lat: 51.5472, lon: -0.0556 },
    { name: "Hackney Downs", lat: 51.5480, lon: -0.0600 },
    { name: "Hackney Wick", lat: 51.5435, lon: -0.0255 },
    { name: "Hoxton", lat: 51.5312, lon: -0.0767 },
    { name: "Haggerston", lat: 51.5382, lon: -0.0755 },
    { name: "Homerton", lat: 51.5477, lon: -0.0429 },
    { name: "Kings Cross", lat: 51.5307, lon: -0.1236 },
    { name: "Langdon Park", lat: 51.5235, lon: -0.0094 },
    { name: "Limehouse", lat: 51.5105, lon: -0.0244 },
    { name: "London Bridge", lat: 51.5074, lon: -0.0877 },
    { name: "London Fields", lat: 51.5422, lon: -0.0575 },
    { name: "Liverpool Street", lat: 51.5175, lon: -0.0823 },
    { name: "Mile End", lat: 51.5251, lon: -0.0334 },
    { name: "Old Street", lat: 51.5236, lon: -0.0870 },
    { name: "Pimlico", lat: 51.4913, lon: -0.1267 },
    { name: "Pudding Mill Lane", lat: 51.5147, lon: -0.0101 },
    { name: "Shadwell", lat: 51.5122, lon: -0.0569 },
    { name: "Shoreditch High Street", lat: 51.5235, lon: -0.0755 },
    { name: "South Quay", lat: 51.5021, lon: -0.0223 },
    { name: "Stepney Green", lat: 51.5215, lon: -0.0466 },
    { name: "St. Paul's", lat: 51.5139, lon: -0.0984 },
    { name: "Tower Hill", lat: 51.5100, lon: -0.0773 },
    { name: "Vauxhall", lat: 51.4844, lon: -0.1187 },
    { name: "Wapping", lat: 51.5082, lon: -0.0617 },
    { name: "Waterloo", lat: 51.5030, lon: -0.1128 },
    { name: "Whitechapel", lat: 51.5194, lon: -0.0615 }
  ]

  // Create a default state for filters
  selectedFilters = {
    pubs: false,
    stations: false
  };
  // Array storing Hex Grid data
  hexGrid = [];

  // Array storing all hexagons are shaded green (via their ID) for when a user toggles off a given filter (as we need to reset these)
  greenHexagons = [];

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;

    this.map = new mapboxgl.Map({
      container: this.mapTarget,
      style: "mapbox://styles/mapbox/streets-v10",
    });

    const searchBounds = [
      [-0.0100, 51.5545],
      [-0.0865, 51.5066],
    ];

    this.#boundingBox(searchBounds);
    // Ensure that Hex Grid (and associated fucntions) is only generated once the map has loaded
    this.map.on("load", () => {
      this.#generateHexGrid(searchBounds);
      this.#hexagonClick();
    });
  }

  // Function to define the outer bounds of the base map
  #boundingBox(searchBounds) {
    this.map.fitBounds(searchBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
  }

  // Function to generate the base Hex Grid, overlaid onto the same outer bounds as the base map
  #generateHexGrid(searchBounds) {
    const options = { units: "kilometers" };
    const hexGrid = turf.hexGrid(searchBounds.flat(), 0.4, options);

    // Ensure each hexagon has a unique ID stored in its properties to retrieve later when looking for matches
    const hexGridWithIds = hexGrid.features.map((feature, index) => {
      feature.properties = feature.properties || {};
      feature.properties.id = index;
      return feature;
    });
    this.hexGrid = hexGridWithIds;

    // Pass the hexagons as a source to the map
    this.map.addSource("hexGrid", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: hexGridWithIds
      }
    });

    // Overlay the Hex Grid layer on the map linked to new map source [as above]
    this.map.addLayer({
      id: "hexGridLayer",
      type: "fill",
      source: "hexGrid",
      layout: {},
      paint: {
        "fill-color": "#ffffff",
        "fill-opacity": 0.6,
        "fill-outline-color": "#000000",
      },
    });
  }

  // Function to allow a user to click on a hexagon to see an info pop-up
  #hexagonClick() {
    this.map.on("click", "hexGridLayer", (event) => {
      const clickedHexagonId = event.features[0].properties.id;
      const coordinates = event.lngLat;

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div class="clicked-hexagon">
            <strong class="hexagon-title">Hive ${clickedHexagonId}</strong>
            <p>(${coordinates.lng.toFixed(5)}, ${coordinates.lat.toFixed(5)})</p>
            <button class="btn btn-primary btn-hexagon" onclick="window.location.href='/hexagons/5'">
              View Hive
            </button>
          </div>`)
        .addTo(this.map);
    });
  }

  // Function to handle when a user toggles a filter
  toggleFilter(event) {
    const filterValue = event.target.dataset.mapFilterValue;
    const isChecked = event.target.checked;

    // Update the selectedFilters state
    this.selectedFilters[filterValue] = isChecked;

    // Reset the colour of any previously coloured hexagons (given selectedFilters has changed) and empty the array they are stored in
    this.greenHexagons.forEach((hexId) => {
      this.updateHexagonColor(hexId, "#FFFFFF");
    });
    this.greenHexagons = [];

    // Reprocess hexagon colours based on new filters
    this.updateHexagonsBasedOnFilters();
  }

  // Function to update the hexagons based on selected filters
  updateHexagonsBasedOnFilters() {
    if (this.selectedFilters.pubs) {
      this.pubs.forEach((pub) => this.checkLocationInHexagon(pub, "#25a244"));
    }

    if (this.selectedFilters.stations) {
      this.stations.forEach((station) => this.checkLocationInHexagon(station, "#25a244"));
    }
  }

  // Function to locate each instance of selected filter category (e.g., every pub) and iterate over each hexagon to check if it contains selected instance location(s)
  checkLocationInHexagon(location, color) {
    const locationPoint = turf.point([location.lon, location.lat]);

    this.hexGrid.forEach((hexagon) => {
      const hexagonPolygon = turf.polygon(hexagon.geometry.coordinates);
      const isInside = turf.booleanPointInPolygon(locationPoint, hexagonPolygon);

      // If a hexagon contains an instance location, call function to change it's colour to green
      if (isInside) {
        if (!this.greenHexagons.includes(hexagon.properties.id)) {
          this.updateHexagonColor(hexagon.properties.id, color);
          this.greenHexagons.push(hexagon.properties.id);
        }
      }
    });
  }

  // Function to update the colour of any hexagons that contain location(s) matching selecting filters
  updateHexagonColor() {
    const source = this.map.getSource("hexGrid");

    if (source) {
    const hexGridData = source._data.features;

      // Reset the the colour for each hexagon to white
      hexGridData.forEach((hex) => {
          hex.properties.fillColor = "#FFFFFF";
      });

      // Iterate through hexagons to (a) check whether an instances of the selected location(s) is within a hexagon and, if so, (b) change the colour accordingly
      hexGridData.forEach((hex) => {
          // const hexId = hex.properties.id;
          const isInsidePub = this.pubs.some((pub) => {
              const pubPoint = turf.point([pub.lon, pub.lat]);
              return turf.booleanPointInPolygon(pubPoint, hex);
          });

          const isInsideStation = this.stations.some((station) => {
              const stationPoint = turf.point([station.lon, station.lat]);
              return turf.booleanPointInPolygon(stationPoint, hex);
          });

          // Logic to colour hexagons if 100% of selected filters are matched in a given hexagon
          if (this.selectedFilters.pubs && this.selectedFilters.stations) {
            if (isInsidePub && isInsideStation) {
                hex.properties.fillColor = "#25a244";
            }
          } else if (this.selectedFilters.pubs && isInsidePub) {
            hex.properties.fillColor = "#25a244";
          } else if (this.selectedFilters.stations && isInsideStation) {
            hex.properties.fillColor = "#25a244";
          }
      });

      // Update the Hex Grid source with the new colour data
      source.setData({
          type: "FeatureCollection",
          features: hexGridData
      });

      // Update the fill color property of the hexagon layer
      const colorExpression = ["match", ["get", "id"]];
      hexGridData.forEach((hex) => {
        colorExpression.push(hex.properties.id, hex.properties.fillColor || "#FFFFFF");
      });
      colorExpression.push("#FFFFFF");

      this.map.setPaintProperty("hexGridLayer", "fill-color", colorExpression);
    }
  }
}





// OLD CODE - - - - - - - - - - - - - - - - - - - - - -
//   // Store filters that a user selects
//   selectedFilters = {};
//   // Store which hexagons are shaded green (via their ID) in case a user toggles off a certain filter
//   greenHexagons = [];

//   connect() {
//     mapboxgl.accessToken = this.apiKeyValue;

//     this.map = new mapboxgl.Map({
//       container: this.mapTarget,
//       style: "mapbox://styles/mapbox/streets-v10",
//     });

//     const searchBounds = [
//       [-0.0100, 51.5545],
//       [-0.0865, 51.5066],
//     ];

//     this.#boundingBox(searchBounds);
//     this.map.on("load", () => {
//       this.#generateHexGrid(searchBounds);
//       this.#hexagonClick();
//     });
//   }

//   // Function to define the outer bounds of the base map
//   #boundingBox(searchBounds) {
//     this.map.fitBounds(searchBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
//   }

//   // Function to generate the base Hex Grid, overlaid onto the same outer bounds as the base map
//   #generateHexGrid(searchBounds) {
//     const options = { units: "kilometers" };
//     const hexGrid = turf.hexGrid(searchBounds.flat(), 0.4, options);

//     // Ensure each hexagon has an associated ID stored in its properties and store for later use
//     const hexGridWithIds = hexGrid.features.map((feature, index) => {
//       feature.properties = feature.properties || {}; // Ensure properties exist
//       feature.properties.id = index; // Assign a unique 'id' for each hexagon
//       return feature;
//     });
//     this.hexGrid = hexGridWithIds;

//     // Pass the hexagons from the Hex Grid to Turf.js
//     this.map.addSource("hexGrid", {
//       type: "geojson",
//       data: {
//         type: "FeatureCollection",
//         features: hexGridWithIds
//       }
//     });

//     // Overlay the Hex Grid layer on the map
//     this.map.addLayer({
//       id: "hexGridLayer",
//       type: "fill",
//       source: "hexGrid",
//       layout: {},
//       paint: {
//         "fill-color": "#ffffff",
//         "fill-opacity": 0.6,
//         "fill-outline-color": "#000000",
//       },
//     });
//   }

//   // Function to locate each instance of selected filter location and iterate over each hexagon to check if it contains selected location(s)
//   checkLocationInHexagon(location) {
//     const locationPoint = turf.point([location.lon, location.lat]);

//     this.hexGrid.forEach((hexagon) => {
//       const hexagonPolygon = turf.polygon(hexagon.geometry.coordinates);
//       const isInside = turf.booleanPointInPolygon(locationPoint, hexagonPolygon);

//       if (isInside) {
//         console.log(`${location.name} is inside hexagon ${hexagon.properties.id}`);
//         this.updateHexagonColor(hexagon.properties.id, "#25a244");
//         this.greenHexagons.push(hexagon.properties.id); // Store the green hexagon id
//       }
//     });
//   }

//   // Function to update the colour of any hexagons that do contain location(s) matching selecting filters
//   updateHexagonColor(hexagonIds, color) {
//     const layer = this.map.getLayer("hexGridLayer");

//     if (layer) {
//       const source = this.map.getSource("hexGrid");

//       if (source) {
//         const hexGridData = source._data.features;

//         // Ensure matched hexagon IDs are stored as an array
//         if (!Array.isArray(hexagonIds)) {
//           hexagonIds = [hexagonIds];
//         }

//         // Set colors in the properties of the hexagons
//         hexGridData.forEach((hex) => {
//           if (hexagonIds.includes(hex.properties.id)) {
//             hex.properties.fillColor = color; // Apply the color
//           } else if (!hex.properties.fillColor) {
//             hex.properties.fillColor = "#FFFFFF"; // Default color for non-matched hexagons
//           }
//         });

//         // After modifying the data, we need to update the source
//         source.setData({
//           type: "FeatureCollection",
//           features: hexGridData
//         });

//         // Construct the 'match' expression with hexagon IDs and colors
//         const colorExpression = ["match", ["get", "id"]];

//         // Add each hexagon's id and its color to the expression
//         hexGridData.forEach((hex) => {
//           colorExpression.push(hex.properties.id, hex.properties.fillColor || "#FFFFFF");
//         });

//         // Fallback color if no match is found
//         colorExpression.push("#FFFFFF");

//         // Update the fill color dynamically using the paint property
//         this.map.setPaintProperty("hexGridLayer", "fill-color", colorExpression);
//       }
//     } else {
//       console.error("Hex grid layer or source not found");
//     }
//   }

//   // Function to find each location associated with a given filter and pass each to the function looking for matched Hexagons
//   processLocations() {
//     this.stations.forEach((station) => this.checkLocationInHexagon(station));
//   }

//   // Function to populated the toggledFilters object with all selected options
//   toggleFilter(event) {
//     const filterValue = event.target.dataset.mapFilterValue;
//     const isChecked = event.target.checked;

//     if (isChecked) {
//       this.selectedFilters[filterValue] = true;
//       this.processLocations(); // Recheck stations and highlight them
//     } else {
//       delete this.selectedFilters[filterValue];

//       // Remove green shading from hexagons
//       this.greenHexagons.forEach((hexId) => {
//         this.updateHexagonColor(hexId, "#FFFFFF"); // Set color back to white
//       });
//       this.greenHexagons = []; // Clear the list of green hexagons
//     }

//     console.log("Currently toggled filters:", this.selectedFilters);
//   }

//   // Function to allow a user to click on a hexagon to see information
//   #hexagonClick() {
//     this.map.on("click", "hexGridLayer", (event) => {
//       const clickedHexagonId = event.features[0].properties.id;
//       const coordinates = event.lngLat;
//       new mapboxgl.Popup()
//         .setLngLat(coordinates)
//         .setHTML(
//           `<div class="clicked-hexagon">
//             <strong class="hexagon-title">Hive ${clickedHexagonId}</strong>
//             <p>(${coordinates.lng.toFixed(5)}, ${coordinates.lat.toFixed(5)})</p>
//             <button class="btn btn-primary btn-hexagon" onclick="window.location.href='/hexagons/2'">
//               View Hive
//             </button>
//           </div>`)
//         .addTo(this.map);
//     });
//   }
// }

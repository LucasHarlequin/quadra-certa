# Baixa as fotos dos produtos (Unsplash) para a pasta img/produtos
# Como usar: abra o terminal nesta pasta e rode:
#   powershell -ExecutionPolicy Bypass -File baixar-imagens.ps1
New-Item -ItemType Directory -Force -Path "img/produtos" | Out-Null
$fotos = @(
  "photo-1512374382149-233c42b6a83b",
  "photo-1519861531473-9200262188bf",
  "photo-1542219550-37153d387c27",
  "photo-1552346154-21d32810aba3",
  "photo-1580089595767-98745d7025c5",
  "photo-1580969661165-8c2b5d9721b5",
  "photo-1588099768550-4014589e03e0",
  "photo-1595795279832-13f0df36fbb9",
  "photo-1595909236612-9fd30b476365",
  "photo-1595909336425-5bf541155dec",
  "photo-1597045566677-8cf032ed6634",
  "photo-1600185365483-26d7a4cc7519",
  "photo-1602231379593-b85a472e3c99",
  "photo-1605348532760-6753d2c43329",
  "photo-1605523741177-cd660595c2cf",
  "photo-1608508136365-89375aa78e0c",
  "photo-1627627256672-027a4613d028",
  "photo-1631984564919-1f6b2313a71c",
  "photo-1656944227421-416b1d2186c9",
  "photo-1698322830976-4a3fdfb293d5",
  "photo-1699901232384-f1646fb2a8da",
  "photo-1710945261882-a94b3f31b15e",
  "photo-1731132198530-e4b2dc51d511",
  "photo-1757513189385-580a91ac7fe4"
)
foreach ($f in $fotos) {
  Write-Host "Baixando $f..."
  Invoke-WebRequest -Uri "https://images.unsplash.com/${f}?w=700&h=560&fit=crop&q=75&fm=jpg" -OutFile "img/produtos/$f.jpg"
}
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&h=700&fit=crop&q=75&fm=jpg" -OutFile "img/banner.jpg"
Write-Host "Pronto! Fotos salvas em img/produtos"

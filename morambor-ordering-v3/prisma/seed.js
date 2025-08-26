
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()
async function run(){
  await prisma.store.upsert({ where: { id:'kralupy' }, update:{}, create:{ id:'kralupy', name:'Kralupy nad Vltavou', address:'Jungmannova 89/6, Kralupy', card:true } })
  await prisma.store.upsert({ where: { id:'libcice' }, update:{}, create:{ id:'libcice', name:'Libčice nad Vltavou', address:'Chýnovská 240, Libčice', card:true } })
  await prisma.banner.upsert({ where: { id:1 }, update:{}, create:{ id:1, enabled:true, width:1200, height:280, img:'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop', link:'https://morambor.cz' } })
  const prods = [
    { id:'houskovy-700', name:'Houskový knedlík 700 g', priceCzk:26, unit:'ks', weight_g:700, img:'https://images.unsplash.com/photo-1549931319-19f6c5c7a3b2?q=80&w=800&auto=format&fit=crop', description:'Tradiční houskový knedlík, ideální k omáčkám.', allergens:['gluten','egg'], categories:['Knedlíky'], availableDays:['mon','tue','wed','thu','fri','sat'] },
    { id:'ruzenin', name:'Růženín – chléb s červenou řepou', priceCzk:69, unit:'ks', weight_g:800, img:'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800&auto=format&fit=crop', description:'Pšenično-žitný chléb s jemnou chutí řepy.', allergens:['gluten','sesame'], categories:['Chléb'], availableDays:['mon','tue','wed','thu','fri','sat'] }
  ]
  for(const p of prods){ await prisma.product.upsert({ where:{ id:p.id }, update:{}, create:p }) }
  const pinHash = await bcrypt.hash('1234', 10)
  await prisma.employee.upsert({ where: { id:'seed-emp-1' }, update:{}, create:{ id:'seed-emp-1', name:'Jan Novák', pinHash, active:true } })
  console.log('Seed done')
}
run().finally(()=>prisma.$disconnect())

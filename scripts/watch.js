import esbuild from 'esbuild'

esbuild.build({
    entryPoints: ['src/background.js',
    'src/scripts/scrapper.js',
    'src/scripts/getUrls.js',
    'src/scripts/scrapContactInfo.js',
    'src/scripts/getExtraExperience.js',
    'src/scripts/getExtraEducation.js'],
    outdir: 'build',
    bundle: true,
    watch: true,
}).then(result => {
    console.log('watching...')
    console.log(result)
}).catch(error=>{
    console.log(error)
})
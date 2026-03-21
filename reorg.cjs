const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');
const pagesDir = path.join(srcDir, 'pages');

const mapping = {
  home: [
    'HeroSection.tsx',
    'ProblemSection.tsx',
    'SolutionSection.tsx',
    'HowItWorksSection.tsx',
    'FeaturesSection.tsx',
    'DashboardPreview.tsx',
    'ComparisonTable.tsx',
    'ImpactStats.tsx',
    'FinalCTA.tsx',
  ],
  about: [
    'AboutHero.tsx',
    'VisionMission.tsx',
    'AboutApproach.tsx',
    'AboutTeam.tsx',
    'AboutRoadmap.tsx',
  ],
  common: [
    'Navbar.tsx',
    'Footer.tsx',
  ],
};

// Create folders and move files
for (const [folder, files] of Object.entries(mapping)) {
  const folderPath = path.join(componentsDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  for (const file of files) {
    const oldPath = path.join(componentsDir, file);
    const newPath = path.join(folderPath, file);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Moved ${file} to ${folder}`);
    }
  }
}

// Update imports in pages
const updateImports = (filePaths, importPrefix = '../components') => {
  for (const file of filePaths) {
    if (!fs.existsSync(file)) continue;
    
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    for (const [folder, files] of Object.entries(mapping)) {
      for (const componentFile of files) {
        const componentName = componentFile.replace('.tsx', '');
        const oldImport = new RegExp(`from '(\\.\\.?)\\/components\\/${componentName}'`, 'g');
        const newImport = `from '$1/components/${folder}/${componentName}'`;
        
        if (oldImport.test(content)) {
          content = content.replace(oldImport, newImport);
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`Updated imports in ${path.basename(file)}`);
    }
  }
};

const pagesFiles = fs.readdirSync(pagesDir).map(file => path.join(pagesDir, file));
updateImports(pagesFiles);
updateImports([path.join(srcDir, 'App.tsx')]);

// Fix Navbar ui import
const navbarPath = path.join(componentsDir, 'common', 'Navbar.tsx');
if (fs.existsSync(navbarPath)) {
  let navbarContent = fs.readFileSync(navbarPath, 'utf8');
  if (navbarContent.includes("'./ui/mini-navbar'")) {
    navbarContent = navbarContent.replace("'./ui/mini-navbar'", "'../ui/mini-navbar'");
    fs.writeFileSync(navbarPath, navbarContent);
    console.log("Updated ui relative import in Navbar.tsx");
  }
}

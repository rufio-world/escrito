# Pirepe Builder WordPress Install

To install the theme in WordPress, upload a ZIP that contains the theme root
folder (with `style.css` at the top level). The repository includes a helper
script that packages the theme correctly.

```bash
cd wordpress
./package-theme.sh
```

Upload `wordpress/dist/pirepe-theme.zip` in **Appearance → Themes → Add New**.

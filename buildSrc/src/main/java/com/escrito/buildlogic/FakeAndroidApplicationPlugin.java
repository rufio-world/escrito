package com.escrito.buildlogic;

import org.gradle.api.JavaVersion;
import org.gradle.api.Plugin;
import org.gradle.api.Action;
import org.gradle.api.Project;

public class FakeAndroidApplicationPlugin implements Plugin<Project> {
    @Override
    public void apply(Project target) {
        target.getExtensions().create("android", FakeAndroidExtension.class, target);
        String[] configurations = new String[] {
            "implementation",
            "debugImplementation",
            "testImplementation",
            "androidTestImplementation",
            "kapt"
        };
        for (String configuration : configurations) {
            target.getConfigurations().maybeCreate(configuration);
        }

        target.getTasks().register("test", task -> {
            task.setGroup("verification");
            task.setDescription("Runs unit tests (stubbed in buildSrc).");
        });
    }

    public static class FakeAndroidExtension {
        private String namespace = "";
        private int compileSdk;
        private final DefaultConfig defaultConfig = new DefaultConfig();
        private final BuildTypes buildTypes;
        private final CompileOptions compileOptions = new CompileOptions();
        private final KotlinOptions kotlinOptions = new KotlinOptions();
        private final BuildFeatures buildFeatures = new BuildFeatures();
        private final ComposeOptions composeOptions = new ComposeOptions();
        private final Packaging packaging = new Packaging();

        public FakeAndroidExtension(Project project) {
            this.buildTypes = new BuildTypes(project);
        }

        public String getNamespace() {
            return namespace;
        }

        public void setNamespace(String namespace) {
            this.namespace = namespace;
        }

        public int getCompileSdk() {
            return compileSdk;
        }

        public void setCompileSdk(int compileSdk) {
            this.compileSdk = compileSdk;
        }

        public DefaultConfig getDefaultConfig() {
            return defaultConfig;
        }

        public void defaultConfig(Action<DefaultConfig> action) {
            action.execute(defaultConfig);
        }

        public BuildTypes getBuildTypes() {
            return buildTypes;
        }

        public void buildTypes(Action<BuildTypes> action) {
            action.execute(buildTypes);
        }

        public CompileOptions getCompileOptions() {
            return compileOptions;
        }

        public void compileOptions(Action<CompileOptions> action) {
            action.execute(compileOptions);
        }

        public KotlinOptions getKotlinOptions() {
            return kotlinOptions;
        }

        public void kotlinOptions(Action<KotlinOptions> action) {
            action.execute(kotlinOptions);
        }

        public BuildFeatures getBuildFeatures() {
            return buildFeatures;
        }

        public void buildFeatures(Action<BuildFeatures> action) {
            action.execute(buildFeatures);
        }

        public ComposeOptions getComposeOptions() {
            return composeOptions;
        }

        public void composeOptions(Action<ComposeOptions> action) {
            action.execute(composeOptions);
        }

        public Packaging getPackaging() {
            return packaging;
        }

        public void packaging(Action<Packaging> action) {
            action.execute(packaging);
        }

        public String getDefaultProguardFile(String name) {
            return name;
        }
    }

    public static class DefaultConfig {
        private String applicationId = "";
        private int minSdk;
        private int targetSdk;
        private int versionCode;
        private String versionName = "";
        private String testInstrumentationRunner = "";

        public String getApplicationId() {
            return applicationId;
        }

        public void setApplicationId(String applicationId) {
            this.applicationId = applicationId;
        }

        public int getMinSdk() {
            return minSdk;
        }

        public void setMinSdk(int minSdk) {
            this.minSdk = minSdk;
        }

        public int getTargetSdk() {
            return targetSdk;
        }

        public void setTargetSdk(int targetSdk) {
            this.targetSdk = targetSdk;
        }

        public int getVersionCode() {
            return versionCode;
        }

        public void setVersionCode(int versionCode) {
            this.versionCode = versionCode;
        }

        public String getVersionName() {
            return versionName;
        }

        public void setVersionName(String versionName) {
            this.versionName = versionName;
        }

        public String getTestInstrumentationRunner() {
            return testInstrumentationRunner;
        }

        public void setTestInstrumentationRunner(String testInstrumentationRunner) {
            this.testInstrumentationRunner = testInstrumentationRunner;
        }
    }

    public static class BuildTypes {
        private final BuildType release;

        public BuildTypes(Project project) {
            this.release = new BuildType(project);
        }

        public BuildType getRelease() {
            return release;
        }

        public void release(Action<BuildType> action) {
            action.execute(release);
        }
    }

    public static class BuildType {
        private final Project project;
        private boolean minifyEnabled;

        public BuildType(Project project) {
            this.project = project;
        }

        public boolean isMinifyEnabled() {
            return minifyEnabled;
        }

        public void setMinifyEnabled(boolean minifyEnabled) {
            this.minifyEnabled = minifyEnabled;
        }

        public void proguardFiles(Object... files) {
            project.getLogger().debug("Fake proguard files: " + java.util.Arrays.toString(files));
        }
    }

    public static class CompileOptions {
        private JavaVersion sourceCompatibility = JavaVersion.VERSION_17;
        private JavaVersion targetCompatibility = JavaVersion.VERSION_17;

        public JavaVersion getSourceCompatibility() {
            return sourceCompatibility;
        }

        public void setSourceCompatibility(JavaVersion sourceCompatibility) {
            this.sourceCompatibility = sourceCompatibility;
        }

        public JavaVersion getTargetCompatibility() {
            return targetCompatibility;
        }

        public void setTargetCompatibility(JavaVersion targetCompatibility) {
            this.targetCompatibility = targetCompatibility;
        }
    }

    public static class KotlinOptions {
        private String jvmTarget = "17";

        public String getJvmTarget() {
            return jvmTarget;
        }

        public void setJvmTarget(String jvmTarget) {
            this.jvmTarget = jvmTarget;
        }
    }

    public static class BuildFeatures {
        private boolean compose;

        public boolean getCompose() {
            return compose;
        }

        public void setCompose(boolean compose) {
            this.compose = compose;
        }
    }

    public static class ComposeOptions {
        private String kotlinCompilerExtensionVersion = "";

        public String getKotlinCompilerExtensionVersion() {
            return kotlinCompilerExtensionVersion;
        }

        public void setKotlinCompilerExtensionVersion(String kotlinCompilerExtensionVersion) {
            this.kotlinCompilerExtensionVersion = kotlinCompilerExtensionVersion;
        }
    }

    public static class Packaging {
        private final PackagingResources resources = new PackagingResources();

        public PackagingResources getResources() {
            return resources;
        }

        public void resources(Action<PackagingResources> action) {
            action.execute(resources);
        }
    }

    public static class PackagingResources {
        private final java.util.Set<String> excludes = new java.util.LinkedHashSet<>();

        public java.util.Set<String> getExcludes() {
            return excludes;
        }
    }

}

package com.escrito.buildlogic;

import org.gradle.api.Plugin;
import org.gradle.api.Project;

public class FakeKaptPlugin implements Plugin<Project> {
    @Override
    public void apply(Project target) {
        target.getConfigurations().maybeCreate("kapt");
    }
}

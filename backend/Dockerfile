FROM java
COPY . /srv/
WORKDIR /srv/
RUN wget https://services.gradle.org/distributions/gradle-6.3-bin.zip -P /tmp
RUN unzip -d /opt/gradle /tmp/gradle-*.zip
RUN ls /opt/gradle/gradle-*
RUN /opt/gradle/gradle-6.3/bin/gradle -v
CMD /opt/gradle/gradle-6.3/bin/gradle bootRun

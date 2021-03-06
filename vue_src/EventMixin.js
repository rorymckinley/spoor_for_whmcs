export default {
  computed: {
    assessment() {
      return {
        confirmed_malicious: 'Confirmed Malicious',
        probably_malicious: 'Probably Malicious',
        probably_benign: 'Probably Benign',
        confirmed_benign: 'Confirmed Benign',
      }[this.eventData.latest_assessment];
    },
    date() {
      const date = new Date(this.eventData.event_time * 1000);
      return date.toLocaleString(spoorLocalisation, {
        timeZoneName: 'short',
      });
    },
    type() {
      return {
        login: 'Login',
        forward_added: 'Forward Added',
        forward_removed: 'Forward Removed',
      }[this.eventData.type];
    },
  },
  methods: {
    humanizeAssessment(assessment) {
      return {
        confirmed_malicious: 'Confirmed Malicious',
        probably_malicious: 'Probably Malicious',
        probably_benign: 'Probably Benign',
        confirmed_benign: 'Confirmed Benign',
      }[assessment];
    },
  },
};

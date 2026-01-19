import { apiFetch } from "@/lib/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import DocumentChecklist from "@/components/DocumentChecklist";
import StatusUpdateModal from "@/components/StatusUpdateModal";

/* ---------------- Types ---------------- */

type VisaApplicationStatus =
  | "NOT_STARTED"
  | "DOCUMENTS_IN_PROGRESS"
  | "APPOINTMENT_BOOKED"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

type VisaApplication = {
  _id: string;
  status: VisaApplicationStatus;
  appointmentDate?: string;
  submissionDate?: string;
  decisionDate?: string;
  createdAt: string;
  updatedAt: string;
};

type TrackingResponse = {
  application: VisaApplication;
  documents: {
    mandatory: {
      documentType: string;
      uploaded: boolean;
    }[];
    progress: {
      uploaded: number;
      total: number;
    };
  };
};

/* ---------------- Timeline config ---------------- */

const TIMELINE_STEPS: {
  key: VisaApplicationStatus;
  title: string;
  dateField?: keyof VisaApplication;
}[] = [
  { key: "DOCUMENTS_IN_PROGRESS", title: "Documents in progress" },
  {
    key: "APPOINTMENT_BOOKED",
    title: "Appointment booked",
    dateField: "appointmentDate",
  },
  {
    key: "SUBMITTED",
    title: "Submitted to embassy",
    dateField: "submissionDate",
  },
  { key: "UNDER_REVIEW", title: "Embassy reviewing" },
  {
    key: "APPROVED",
    title: "Approved",
    dateField: "decisionDate",
  },
  {
    key: "REJECTED",
    title: "Rejected",
    dateField: "decisionDate",
  },
];

const NEXT_STATUS_MAP: Record<
  VisaApplicationStatus,
  VisaApplicationStatus | null
> = {
  NOT_STARTED: "DOCUMENTS_IN_PROGRESS",
  DOCUMENTS_IN_PROGRESS: "APPOINTMENT_BOOKED",
  APPOINTMENT_BOOKED: "SUBMITTED",
  SUBMITTED: "UNDER_REVIEW",
  UNDER_REVIEW: null,
  APPROVED: null,
  REJECTED: null,
  CANCELLED: null,
};

const STATUS_ORDER: VisaApplicationStatus[] = [
  "DOCUMENTS_IN_PROGRESS",
  "APPOINTMENT_BOOKED",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
];


/* ---------------- Screen ---------------- */

export default function ApplicationTrackerScreen() {
  const { applicationId } =
    useLocalSearchParams<{ applicationId: string }>();

  const [data, setData] = useState<TrackingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const application = data?.application;

  async function loadTracking() {
    const res = await apiFetch(
      `/visa-applications/${applicationId}/tracking`
    );
    setData(res);
  }

  useEffect(() => {
    if (!applicationId) return;
    loadTracking().finally(() => setLoading(false));
  }, [applicationId]);

  async function handleStatusUpdate() {
    if (!application) return;

    const nextStatus = NEXT_STATUS_MAP[application.status];
    if (!nextStatus) return;

    await apiFetch(
      `/visa-applications/${application._id}/status`,
      {
        method: "POST",
        body: JSON.stringify({ status: nextStatus }),
      }
    );

    setShowStatusModal(false);
    await loadTracking();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data || !application) {
    return (
      <View style={styles.center}>
        <Text>Application not found</Text>
      </View>
    );
  }

  const nextStatus = NEXT_STATUS_MAP[application.status];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Visa Application Tracker</Text>

      {/* ---------- Timeline ---------- */}
    {TIMELINE_STEPS.map((step, index) => {
  const currentIndex = STATUS_ORDER.indexOf(application.status);
  const isCompleted = index < currentIndex;
  const isActive = index === currentIndex;

  const dateValue =
    step.dateField && application[step.dateField]
      ? application[step.dateField]
      : null;

  return (
    <View key={step.key} style={styles.stepRow}>
      {/* Timeline column */}
      <View style={styles.timelineCol}>
        <View
          style={[
            styles.dot,
            isCompleted && styles.dotDone,
            isActive && styles.dotActive,
          ]}
        />
        {index !== TIMELINE_STEPS.length - 1 && (
          <View style={styles.line} />
        )}
      </View>

      {/* Content */}
      <View style={styles.stepContent}>
        <Text
          style={[
            styles.stepTitle,
            isActive && styles.stepTitleActive,
          ]}
        >
          {step.title}
        </Text>

        {dateValue && (
          <Text style={styles.stepDate}>
            {new Date(dateValue).toDateString()}
          </Text>
        )}
      </View>
    </View>
  );
})}


      {/* ---------- Documents ---------- */}
      <DocumentChecklist applicationId={application._id} />

      {/* ---------- Status CTA ---------- */}
      {nextStatus && (
        <Pressable
          style={styles.cta}
          onPress={() => setShowStatusModal(true)}
        >
          <Text style={styles.ctaText}>
            Mark as{" "}
            {nextStatus
              .replace(/_/g, " ")
              .toLowerCase()}
          </Text>
        </Pressable>
      )}

      {/* ---------- Status Modal ---------- */}
      <StatusUpdateModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusUpdate}
        nextStatusLabel={
          nextStatus
            ? nextStatus.replace(/_/g, " ")
            : ""
        }
      />
    </ScrollView>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111827",
  },

  stepRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },

  
  dotInactive: {
    backgroundColor: "#D1D5DB",
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 15,
    color: "#6B7280",
  },

  stepTitleActive: {
    color: "#111827",
    fontWeight: "600",
  },

  stepDate: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  cta: {
    marginTop: 24,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  ctaText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  timelineCol: {
  width: 24,
  alignItems: "center",
},

line: {
  flex: 1,
  width: 2,
  backgroundColor: "#E5E7EB",
  marginTop: 2,
},

dotDone: {
  backgroundColor: "#16A34A",
},

dotActive: {
  backgroundColor: "#2563EB",
},

});

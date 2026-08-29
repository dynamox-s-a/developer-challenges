CREATE TYPE "public"."machine_type" AS ENUM('Pump', 'Fan');--> statement-breakpoint
CREATE TYPE "public"."sensor_model" AS ENUM('TcAg', 'TcAs', 'HF+');--> statement-breakpoint
CREATE TABLE "machines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"type" "machine_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monitoring_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"machine_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sensors" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"monitoring_point_id" uuid NOT NULL,
	"model" "sensor_model" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_series" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sensor_id" varchar(120) NOT NULL,
	"label" varchar(120),
	"sample_count" integer NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "time_series_sample_count_check" CHECK ("time_series"."sample_count" between 1 and 10000),
	CONSTRAINT "time_series_date_order_check" CHECK ("time_series"."started_at" <= "time_series"."ended_at")
);
--> statement-breakpoint
CREATE TABLE "time_series_samples" (
	"series_id" uuid NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"x" double precision NOT NULL,
	"y" double precision NOT NULL,
	"z" double precision NOT NULL,
	CONSTRAINT "time_series_samples_series_id_timestamp_pk" PRIMARY KEY("series_id","timestamp")
);
--> statement-breakpoint
ALTER TABLE "monitoring_points" ADD CONSTRAINT "monitoring_points_machine_id_machines_id_fk" FOREIGN KEY ("machine_id") REFERENCES "public"."machines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_monitoring_point_id_monitoring_points_id_fk" FOREIGN KEY ("monitoring_point_id") REFERENCES "public"."monitoring_points"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_series" ADD CONSTRAINT "time_series_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_series_samples" ADD CONSTRAINT "time_series_samples_series_id_time_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."time_series"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "machines_name_idx" ON "machines" USING btree ("name");--> statement-breakpoint
CREATE INDEX "monitoring_points_machine_name_idx" ON "monitoring_points" USING btree ("machine_id","name");--> statement-breakpoint
CREATE INDEX "monitoring_points_name_idx" ON "monitoring_points" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "sensors_monitoring_point_id_uidx" ON "sensors" USING btree ("monitoring_point_id");--> statement-breakpoint
CREATE INDEX "sensors_model_idx" ON "sensors" USING btree ("model");--> statement-breakpoint
CREATE INDEX "time_series_sensor_id_idx" ON "time_series" USING btree ("sensor_id");--> statement-breakpoint
CREATE INDEX "time_series_created_at_idx" ON "time_series" USING btree ("created_at");
